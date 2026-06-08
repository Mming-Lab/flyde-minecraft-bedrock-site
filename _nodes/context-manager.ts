import type { World, Player } from 'socket-be'

interface McContext {
  world: World
  player: Player
}

let _ctx: McContext | null = null

export function setCurrentContext(world: World, player: Player): void {
  _ctx = { world, player }
}

export function getCurrentContext(): McContext {
  if (!_ctx) throw new Error('マインクラフトとの接続がありません。先に接続してください。')
  return _ctx
}
