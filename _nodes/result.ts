import { CodeNode } from '@flyde/core'
import type { Result, McContext } from './types/common'
import { Ok } from './types/common'

const STYLE = { color: '#767676' } // utility

export const コンテキストを作る: CodeNode = {
  id: 'CreateContext',
  displayName: 'コンテキストを作る',
  menuDisplayName: 'ｺﾝﾃｷｽﾄ作成',
  defaultStyle: STYLE,
  inputs: {
    ワールド: { description: 'Minecraftワールド' },
    プレイヤー: { description: 'プレイヤー' },
  },
  outputs: {
    Result: {},
  },
  run: ({ ワールド, プレイヤー }, { Result: result }) => {
    const ctx: McContext = { world: ワールド, player: プレイヤー }
    result.next(Ok(ctx))
  },
}

export const 結果で分岐: CodeNode = {
  id: 'SplitResult',
  displayName: '結果で分岐',
  menuDisplayName: '結果で分岐',
  defaultStyle: STYLE,
  inputs: {
    Result: { description: 'Result型の値' },
  },
  outputs: {
    成功: {},
    失敗: {},
  },
  run: ({ Result: raw }, { 成功, 失敗 }) => {
    const r = raw as Result
    if (r.ok) {
      成功.next(r.value)
    } else {
      失敗.next(r.error)
    }
  },
}

export const 成功を取り出す: CodeNode = {
  id: 'UnwrapOk',
  displayName: '成功を取り出す',
  menuDisplayName: '成功取り出す',
  defaultStyle: STYLE,
  inputs: {
    Result: { description: 'Ok型のResult' },
  },
  outputs: {
    値: {},
  },
  run: ({ Result: raw }, { 値 }) => {
    const r = raw as Result
    if (r.ok) {
      値.next(r.value)
    }
  },
}

export const エラーを取り出す: CodeNode = {
  id: 'UnwrapErr',
  displayName: 'エラーを取り出す',
  menuDisplayName: 'ｴﾗｰ取出す',
  defaultStyle: STYLE,
  inputs: {
    Result: { description: 'Err型のResult' },
  },
  outputs: {
    エラー: {},
  },
  run: ({ Result: raw }, { エラー }) => {
    const r = raw as Result
    if (!r.ok) {
      エラー.next(r.error)
    }
  },
}
