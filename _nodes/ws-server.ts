import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { Server, ServerEvent, type World } from 'socket-be'
import { diagLog } from './diag'

const log = (msg: string) => diagLog('INFO',  'ws-server', msg)
const dbg = (msg: string) => diagLog('DEBUG', 'flyde-mc',  msg)

// Flyde がフロー再起動時にモジュールキャッシュをクリアして再 require することがある。
// _server / _world を process に退避しておき、再ロード後も復元する。
let _server: Server | null = (process as any).__fmcServer ?? null
let _world: World | null  = (process as any).__fmcWorld  ?? null
let _port: number = (process as any).__fmcPort ?? 8080

function syncToProcess() {
  ;(process as any).__fmcServer = _server
  ;(process as any).__fmcWorld  = _world
  ;(process as any).__fmcPort   = _port
}

// イベントノードが world.server.on() で使う World オブジェクトをシングルトンで保持する。
// socket-be の World は Flyde の socket.io IPC でシリアライズできないため、
// Flyde ピン経由では渡さず、この関数経由で取得する。
// Flyde が各ノードを別モジュールインスタンスでロードする場合に備え、
// _world が null なら process.__fmcWorld を遅延チェックする。
export function getCurrentWorld(): World | null {
  if (!_world) _world = (process as any).__fmcWorld ?? null
  return _world
}

// PID ファイルのパス（ポートごとに分ける）
function pidFilePath(port: number) {
  return join(tmpdir(), `flyde-mc-${port}.pid`)
}

// 前回の自プロセスを PID ファイル経由で終了させる（他アプリには触れない）
function killPreviousProcess(port: number): void {
  const file = pidFilePath(port)
  if (!existsSync(file)) return
  try {
    const pid = parseInt(readFileSync(file, 'utf8').trim(), 10)
    if (pid > 0 && pid !== process.pid) {
      process.kill(pid)
      log(`⚠️ Terminated previous flyde-mc process (PID: ${pid})`)
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
  if (!_server) _server = (process as any).__fmcServer ?? null  // 別インスタンスが起動済みなら復元
  if (!_server) {
    dbg(`getServer(${port}) called - creating new server (PID=${process.pid}, connected=${process.connected})`)
    _port = port
    killPreviousProcess(port)  // 前回の自プロセスが残留していれば終了させる
    writePidFile(port)
    _server = new Server({ port, disableEncryption: true, webSocketOptions: { host: '0.0.0.0' } })
    syncToProcess()
    dbg(`Server instance created`)

    // サーバーが実際に listen 開始したことを確認するログ
    _server.on(ServerEvent.Open, () => {
      dbg(`ServerEvent.Open fired`)
      log(`✅ Server ready: ws://localhost:${port}`)
      log(`   Run /connect localhost:${port} in Minecraft`)
    })

    // WorldAdd / WorldRemove をインスタンス直後から監視
    // WorldAdd で _world をセットしてから connection.ts の handler が ワールド.next(true) を流す
    _server.on(ServerEvent.WorldAdd, (signal: any) => {
      _world = signal.world
      syncToProcess()
      dbg(`WorldAdd fired! world=${typeof signal?.world}`)
    })
    _server.on(ServerEvent.WorldRemove, (signal: any) => {
      _world = null
      syncToProcess()
      dbg(`WorldRemove fired! code=${signal?.code}`)
    })

    // new Server() は server.network.wss (ws.WebSocketServer) を内部で起動する。
    // EADDRINUSE はその非同期初期化で発生するため try-catch では捕捉できない。
    const wss: NodeJS.EventEmitter | undefined = (_server as any).network?.wss
    dbg(`network.wss available: ${!!wss}`)
    if (wss?.on) {
      wss.on('error', (err: Error) => {
        diagLog('WARN',  'flyde-mc',  `WSS error: ${err.message}`)
        diagLog('ERROR', 'ws-server', `❌ Server error: ${err.message}`)
        _server = null
        syncToProcess()
        onError?.(err.message)
      })
      wss.on('connection', (ws: any) => {
        dbg(`WSS: new WebSocket connection established`)
        ws.once('close', (code: number, reason: Buffer) => {
          dbg(`WSS: WebSocket closed code=${code} reason=${reason?.toString()}`)
        })
        ws.once('error', (err: Error) => {
          diagLog('WARN', 'flyde-mc', `WSS: WebSocket error: ${err.message}`)
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
            dbg(`MC→Server msg#${msgCount}: purpose=${purpose} statusCode=${status} eventName=${parsed?.header?.eventName}`)
          } catch {
            dbg(`MC→Server msg#${msgCount}: (non-JSON or binary, len=${data?.length})`)
          }
        }
        ws.on('message', msgListener)
      })
    }

    log(`Starting server... ws://localhost:${port}`)
  }
  return _server!
}

// フロー停止時にポートを解放する。onCleanup から呼ぶこと。
export async function stopServer(): Promise<void> {
  if (!_server) return
  dbg('stopServer called from:\n' + new Error().stack)
  const s = _server
  _server = null
  _world = null
  syncToProcess()
  deletePidFile(_port)
  try {
    await s.stop()
    log('Server stopped')
  } catch {
    // すでに閉じている場合などは無視
  }
}

// Flyde がフロー再起動時にモジュールキャッシュをクリアして再 require することがある。
// process オブジェクト自体にフラグを持たせ、同一プロセスで重複登録を防ぐ。
if (!(process as any).__fmcSignalHandlersRegistered) {
  ;(process as any).__fmcSignalHandlersRegistered = true
  process.once('SIGTERM', () => { diagLog('INFO', 'flyde-mc', 'SIGTERM received'); stopServer().finally(() => process.exit(0)) })
  process.once('SIGINT',  () => { diagLog('INFO', 'flyde-mc', 'SIGINT received');  stopServer().finally(() => process.exit(0)) })
  // タブを閉じると fork() の IPC チャンネルが切断され disconnect イベントが発火する。
  // SIGTERM が来ない場合でもここでポートを解放してプロセスを終了する。
  process.once('disconnect', () => { diagLog('INFO', 'flyde-mc', 'disconnect event fired!'); stopServer().finally(() => process.exit(0)) })
  // 未キャッチ例外を diagLog に記録（console は Flyde 環境では見えない）
  process.on('uncaughtException', (err: Error) => {
    diagLog('ERROR', 'flyde-mc', `UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}`)
  })
}
