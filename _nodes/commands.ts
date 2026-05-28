import { CodeNode } from '@flyde/core'
import { Ok, Err } from './types/common'
import type { Result, McContext } from './types/common'

const PLAYER_STYLE = { color: '#0078D7' }   // player
const GAMEPLAY_STYLE = { color: '#8F6D40' } // gameplay

// 二軌道関数のヘルパー: Result<McContext> を受け取り、Err ならそのまま通過
function unwrapCtx(raw: unknown): { ok: true; ctx: McContext } | { ok: false; err: Result } {
  const r = raw as Result<McContext>
  if (!r.ok) return { ok: false, err: r }
  return { ok: true, ctx: r.value }
}

export const コマンド実行: CodeNode = {
  id: 'RunCommand',
  displayName: 'コマンド実行',
  menuDisplayName: 'ｺﾏﾝﾄﾞ実行',
  defaultStyle: GAMEPLAY_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    コマンド: { description: '実行するコマンド（/ は不要）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, コマンド }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.world.runCommand(コマンド)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const メッセージ送信: CodeNode = {
  id: 'SendMessage',
  displayName: 'メッセージ送信',
  menuDisplayName: 'ﾒｯｾｰｼﾞ送信',
  defaultStyle: PLAYER_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    メッセージ: { description: '送信するテキスト' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, メッセージ }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.player.sendMessage(メッセージ)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

// エラーハンドラー用: 鉄道の外（SplitResult の失敗側）で使う平常ノード
export const 全員にメッセージ: CodeNode = {
  id: 'SendMessageAll',
  displayName: '全員にメッセージ',
  menuDisplayName: '全員送信',
  defaultStyle: GAMEPLAY_STYLE,
  inputs: {
    ワールド: { description: 'Minecraftワールド' },
    テキスト: { description: '全員に送るテキスト' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ ワールド, テキスト }, { Result: result }) => {
    try {
      await ワールド.runCommand(`say ${テキスト}`)
      result.next(Ok(true))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const エフェクト付与: CodeNode = {
  id: 'ApplyEffect',
  displayName: 'エフェクト付与',
  menuDisplayName: 'ｴﾌｪｸﾄ付与',
  defaultStyle: PLAYER_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    エフェクト名: { description: 'エフェクト名（speed / jump_boost / regeneration 等）' },
    秒数: { description: '持続時間（秒）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, エフェクト名, 秒数 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.player.runCommand(`effect @s ${エフェクト名} ${秒数 ?? 30}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const テレポート: CodeNode = {
  id: 'TeleportPlayer',
  displayName: 'テレポート',
  menuDisplayName: 'ﾃﾚﾎﾟｰﾄ',
  defaultStyle: PLAYER_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    x座標: { description: 'X座標' },
    y座標: { description: 'Y座標' },
    z座標: { description: 'Z座標' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, x座標, y座標, z座標 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.player.runCommand(`tp @s ${x座標} ${y座標} ${z座標}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const 時刻変更: CodeNode = {
  id: 'SetTime',
  displayName: '時刻変更',
  menuDisplayName: '時刻変更',
  defaultStyle: GAMEPLAY_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    時刻: { description: '0=夜明け / 6000=正午 / 12000=夕方 / 18000=深夜' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, 時刻 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.world.runCommand(`time set ${時刻}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}

export const 天気変更: CodeNode = {
  id: 'ChangeWeather',
  displayName: '天気変更',
  menuDisplayName: '天気変更',
  defaultStyle: GAMEPLAY_STYLE,
  inputs: {
    コンテキスト: { description: 'Result<McContext>（鉄道のレール）' },
    天気: { description: '天気（clear / rain / thunder）' },
  },
  outputs: {
    Result: {},
  },
  run: async ({ コンテキスト, 天気 }, { Result: result }) => {
    const u = unwrapCtx(コンテキスト)
    if (!u.ok) { result.next(u.err); return }
    try {
      await u.ctx.world.runCommand(`weather ${天気}`)
      result.next(Ok(u.ctx))
    } catch (e) {
      result.next(Err(String(e)))
    }
  },
}
