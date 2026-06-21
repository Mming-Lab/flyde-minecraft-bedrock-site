import type { World, Player } from 'socket-be'

interface McContext {
  world: World
  player: Player
}

// Flyde がモジュールキャッシュをクリアして再 require した場合でも、
// TS ソース・dist バンドルで別インスタンスになった場合でも、
// process オブジェクト経由で同一コンテキストを共有する。
let _ctx: McContext | null = (process as any).__fmcContext ?? null

function syncToProcess(): void {
  ;(process as any).__fmcContext = _ctx
}

export function setCurrentContext(world: World, player: Player): void {
  _ctx = { world, player }
  syncToProcess()
}

export function getCurrentContext(): McContext {
  if (!_ctx) _ctx = (process as any).__fmcContext ?? null
  if (!_ctx) throw new Error('Not connected to Minecraft. Please connect first.')
  return _ctx
}

export function clearCurrentContext(): void {
  _ctx = null
  syncToProcess()
}
