import { Server, ServerEvent } from 'socket-be'

let _server: Server | null = null

// 同一プロセスで複数インスタンスが起動しないようにシングルトンで管理する
// onError: EADDRINUSE などの非同期エラーを呼び出し元に通知するコールバック
export function getServer(port: number = 8080, onError?: (msg: string) => void): Server {
  if (!_server) {
    _server = new Server({ port, disableEncryption: true, webSocketOptions: { host: '0.0.0.0' } })

    // サーバーが実際に listen 開始したことを確認するログ
    _server.on(ServerEvent.Open, () => {
      console.log(`[SocketBE] ✅ サーバー起動完了: ws://localhost:${port}`)
      console.log(`[SocketBE]    Minecraftで /connect localhost:${port} を実行してください`)
    })

    // new Server() は server.network.wss (ws.WebSocketServer) を内部で起動する。
    // EADDRINUSE はその非同期初期化で発生するため try-catch では捕捉できない。
    const wss: NodeJS.EventEmitter | undefined = (_server as any).network?.wss
    if (wss?.on) {
      wss.on('error', (err: Error) => {
        console.error(`[SocketBE] ❌ サーバーエラー: ${err.message}`)
        _server = null
        onError?.(err.message)
      })
    }

    console.log(`[SocketBE] サーバー起動中... ws://localhost:${port}`)
  }
  return _server!
}
