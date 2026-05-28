import { CodeNode } from '@flyde/core'
import { Ok, Err } from './types/common'
import type { Result, McContext } from './types/common'

const STYLE = { color: '#D83B01' } // agent

function unwrapCtx(raw: unknown): { ok: true; ctx: McContext } | { ok: false; err: Result } {
  const r = raw as Result<McContext>
  if (!r.ok) return { ok: false, err: r }
  return { ok: true, ctx: r.value }
}

export const エージェント前進: CodeNode = {
  id: 'AgentMoveForward',
  displayName: 'エージェント前進',
  menuDisplayName: 'Agent前進',
  defaultStyle: STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    歩数: { description: '前進する歩数（デフォルト: 1）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, 歩数 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      const steps: number = 歩数 ?? 1
      for (let i = 0; i < steps; i++) {
        await u.ctx.world.runCommand('agent move forward')
      }
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const エージェント回転: CodeNode = {
  id: 'AgentTurn',
  displayName: 'エージェント回転',
  menuDisplayName: 'Agent回転',
  defaultStyle: STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    方向: { description: '回転方向（left / right）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, 方向 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.world.runCommand(`agent turn ${方向}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const エージェントコマンド: CodeNode = {
  id: 'AgentCommand',
  displayName: 'エージェントコマンド',
  menuDisplayName: 'Agent命令',
  defaultStyle: STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    コマンド: { description: 'agentコマンド本体（例: move forward / place 1）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, コマンド }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.world.runCommand(`agent ${コマンド}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}
