import { existsSync, readFileSync, writeFileSync, unlinkSync, appendFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { Server, ServerEvent, type World } from 'socket-be'

const DIAG_FILE = join(process.cwd(), 'mc-flow-diag.log')
function diagLog(msg: string): void {
  try { appendFileSync(DIAG_FILE, `[${new Date().toISOString()}] ${msg}\n`) } catch {}
}
function log(msg: string): void { diagLog(`[socketbe] ${msg}`) }

let _server: Server | null = null
let _world: World | null = null
let _port: number = 8080

// イベントノードが world.server.on() で使う World オブジェクトをシングルトンで保持する。
// socket-be の World は Flyde の socket.io IPC でシリアライズできないため、
// Flyde ピン経由では渡さず、この関数経由で取得する。
export function getCurrentWorld(): World | null { return _world }

// PID ファイルのパス（ポートごとに分ける）
function pidFilePath(port: number) {
  return join(tmpdir(), `mc-flow-${port}.pid`)
}

// 前回の自プロセスを PID ファイル経由で終了させる（他アプリには触れない）
function killPreviousProcess(port: number): void {
  const file = pidFilePath(port)
  if (!existsSync(file)) return
  try {
    const pid = parseInt(readFileSync(file, 'utf8').trim(), 10)
    if (pid > 0 && pid !== process.pid) {
      process.kill(pid)
      log(`⚠️ 前回の mc-flow プロセス (PID: ${pid}) を終了しました`)
    }
  } catch {
    // プロセスが既に終了済みなら無視
  }
  try { unlinkSync(file) } catch {}
}

function writePidFile(port: number): void {
  try { writeFileSync(pidFilePath(port), String(process.pid), 'utf8') } catch {}
}

function deletePidFile(port: number): void {
  try { unlinkSync(pidFilePath(port)) } catch {}
}

// 同一プロセスで複数インスタンスが起動しないようにシングルトンで管理する
// onError: EADDRINUSE などの非同期エラーを呼び出し元に通知するコールバック
export function getServer(port: number = 8080, onError?: (msg: string) => void): Server {
  if (!_server) {
    diagLog(`[mc-flow] getServer(${port}) called - creating new server (PID=${process.pid}, connected=${process.connected})`)
    _port = port
    killPreviousProcess(port)  // 前回の自プロセスが残留していれば終了させる
    writePidFile(port)
    _server = new Server({ port, disableEncryption: true, webSocketOptions: { host: '0.0.0.0' } })
    diagLog(`[mc-flow] Server instance created`)

    // サーバーが実際に listen 開始したことを確認するログ
    _server.on(ServerEvent.Open, () => {
      diagLog(`[mc-flow] ServerEvent.Open fired`)
      log(`✅ サーバー起動完了: ws://localhost:${port}`)
      log(`   Minecraftで /connect localhost:${port} を実行してください`)
    })

    // WorldAdd / WorldRemove をインスタンス直後から監視
    // WorldAdd で _world をセットしてから connection.ts の handler が ワールド.next(true) を流す
    _server.on(ServerEvent.WorldAdd, (signal: any) => {
      _world = signal.world
      diagLog(`[mc-flow] [ws-server] WorldAdd fired! world=${typeof signal?.world}`)
    })
    _server.on(ServerEvent.WorldRemove, (signal: any) => {
      _world = null
      diagLog(`[mc-flow] [ws-server] WorldRemove fired! code=${signal?.code}`)
    })

    // new Server() は server.network.wss (ws.WebSocketServer) を内部で起動する。
    // EADDRINUSE はその非同期初期化で発生するため try-catch では捕捉できない。
    const wss: NodeJS.EventEmitter | undefined = (_server as any).network?.wss
    diagLog(`[mc-flow] network.wss available: ${!!wss}`)
    if (wss?.on) {
      wss.on('error', (err: Error) => {
        diagLog(`[mc-flow] WSS error: ${err.message}`)
        log(`❌ サーバーエラー: ${err.message}`)
        _server = null
        onError?.(err.message)
      })
      wss.on('connection', (ws: any) => {
        diagLog(`[mc-flow] WSS: new WebSocket connection established`)
        ws.once('close', (code: number, reason: Buffer) => {
          diagLog(`[mc-flow] WSS: WebSocket closed code=${code} reason=${reason?.toString()}`)
        })
        ws.once('error', (err: Error) => {
          diagLog(`[mc-flow] WSS: WebSocket error: ${err.message}`)
        })
        // Minecraft から最初の数メッセージを記録（EncryptionRequired 等の検出用）
        let msgCount = 0
        const msgListener = (data: Buffer) => {
          if (msgCount++ >= 5) { ws.off('message', msgListener); return }
          try {
            const text = data.toString('utf-8')
            const parsed = JSON.parse(text)
            const purpose = parsed?.header?.messagePurpose
            const status = parsed?.body?.statusCode
            diagLog(`[mc-flow] MC→Server msg#${msgCount}: purpose=${purpose} statusCode=${status} eventName=${parsed?.header?.eventName}`)
          } catch {
            diagLog(`[mc-flow] MC→Server msg#${msgCount}: (non-JSON or binary, len=${data?.length})`)
          }
        }
        ws.on('message', msgListener)
      })
    }

    log(`サーバー起動中... ws://localhost:${port}`)
  }
  return _server!
}

// フロー停止時にポートを解放する。onCleanup から呼ぶこと。
export async function stopServer(): Promise<void> {
  if (!_server) return
  diagLog('[mc-flow] stopServer called from:\n' + new Error().stack)
  const s = _server
  _server = null
  _world = null
  deletePidFile(_port)
  try {
    await s.stop()
    log('サーバーを停止しました')
  } catch {
    // すでに閉じている場合などは無視
  }
}

// Flyde が別プロセスでフローを実行する場合、プロセス終了時にもポートを解放する
process.once('SIGTERM', () => { diagLog('[mc-flow] SIGTERM received'); stopServer().finally(() => process.exit(0)) })
process.once('SIGINT',  () => { diagLog('[mc-flow] SIGINT received');  stopServer().finally(() => process.exit(0)) })

// タブを閉じると fork() の IPC チャンネルが切断され disconnect イベントが発火する。
// SIGTERM が来ない場合でもここでポートを解放してプロセスを終了する。
process.once('disconnect', () => { diagLog('[mc-flow] disconnect event fired!'); stopServer().finally(() => process.exit(0)) })

// 未キャッチ例外を diagLog に記録（console は Flyde 環境では見えない）
process.on('uncaughtException', (err: Error) => {
  diagLog(`[mc-flow] UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`)
})
