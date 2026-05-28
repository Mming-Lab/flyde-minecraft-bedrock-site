import { CodeNode } from '@flyde/core'

const STYLE = { color: '#767676' } // utility

export const 文字列結合: CodeNode = {
  id: 'StringConcat',
  displayName: '文字列結合',
  menuDisplayName: '文字列結合',
  defaultStyle: STYLE,
  inputs: {
    前: { description: '前半の文字列' },
    後: { description: '後半の文字列' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 前, 後 }, { 結果 }) => {
    結果.next(String(前) + String(後))
  },
}

export const 数値から文字列: CodeNode = {
  id: 'NumberToString',
  displayName: '数値から文字列',
  menuDisplayName: '数値→文字列',
  defaultStyle: STYLE,
  inputs: {
    数値: { description: '変換する数値' },
  },
  outputs: {
    文字列: {},
  },
  run: ({ 数値 }, { 文字列 }) => {
    文字列.next(String(数値))
  },
}

export const 文字列から数値: CodeNode = {
  id: 'StringToNumber',
  displayName: '文字列から数値',
  menuDisplayName: '文字列→数値',
  defaultStyle: STYLE,
  inputs: {
    文字列: { description: '変換する文字列' },
  },
  outputs: {
    数値: {},
  },
  run: ({ 文字列 }, { 数値 }) => {
    const n = Number(文字列)
    数値.next(isNaN(n) ? 0 : n)
  },
}

export const テキスト整形: CodeNode = {
  id: 'FormatText',
  displayName: 'テキスト整形',
  menuDisplayName: 'ﾃｷｽﾄ整形',
  defaultStyle: STYLE,
  inputs: {
    テンプレート: { description: 'テンプレート文字列（{値} を置換）' },
    値: { description: '置換する値' },
  },
  outputs: {
    結果: {},
  },
  run: ({ テンプレート, 値 }, { 結果 }) => {
    結果.next(String(テンプレート).replace('{値}', String(値)))
  },
}
