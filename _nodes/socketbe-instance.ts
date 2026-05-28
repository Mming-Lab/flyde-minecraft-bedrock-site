import { Server } from 'socket-be'

let _server: Server | null = null

// 同一プロセスで複数インスタンスが起動しないようにシングルトンで管理する
export function getServer(port: number = 8080): Server {
  if (!_server) {
    // Minecraft Education Edition は暗号化ハンドシェイクに対応していないため無効化
    _server = new Server({ port, disableEncryption: true })
    console.log(`[SocketBE] WebSocketサーバー起動: ws://localhost:${port}`)
    console.log(`[SocketBE] Minecraftで /connect localhost:${port} を実行してください`)
  }
  return _server
}
