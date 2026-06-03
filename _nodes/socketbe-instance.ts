import { Server, ServerEvent } from 'socket-be'
import { debugLogger } from '@flyde/core'

const log = debugLogger('socketbe')

let _server: Server | null = null

// 同一プロセスで複数インスタンスが起動しないようにシングルトンで管理する
// onError: EADDRINUSE などの非同期エラーを呼び出し元に通知するコールバック
export function getServer(port: number = 8080, onError?: (msg: string) => void): Server {
  if (!_server) {
    _server = new Server({ port, disableEncryption: true, webSocketOptions: { host: '0.0.0.0' } })

    // サーバーが実際に listen 開始したことを確認するログ
    _server.on(ServerEvent.Open, () => {
      log(`✅ サーバー起動完了: ws://localhost:${port}`)
      log(`   Minecraftで /connect localhost:${port} を実行してください`)
    })

    // new Server() は server.network.wss (ws.WebSocketServer) を内部で起動する。
    // EADDRINUSE はその非同期初期化で発生するため try-catch では捕捉できない。
    const wss: NodeJS.EventEmitter | undefined = (_server as any).network?.wss
    if (wss?.on) {
      wss.on('error', (err: Error) => {
        log(`❌ サーバーエラー: ${err.message}`)
        _server = null
        onError?.(err.message)
      })
    }

    log(`サーバー起動中... ws://localhost:${port}`)
  }
  return _server!
}

// フロー停止時にポートを解放する。onCleanup から呼ぶこと。
export async function stopServer(): Promise<void> {
  if (!_server) return
  const s = _server
  _server = null
  try {
    await s.stop()
    log('サーバーを停止しました')
  } catch {
    // すでに閉じている場合などは無視
  }
}

// Flyde が別プロセスでフローを実行する場合、プロセス終了時にもポートを解放する
process.once('SIGTERM', () => stopServer().finally(() => process.exit(0)))
process.once('SIGINT',  () => stopServer().finally(() => process.exit(0)))

// タブを閉じると fork() の IPC チャンネルが切断され disconnect イベントが発火する。
// SIGTERM が来ない場合でもここでポートを解放してプロセスを終了する。
process.once('disconnect', () => stopServer().finally(() => process.exit(0)))
