import { CodeNode } from '@flyde/core'

// @minecraft/math は @minecraft/server（Bedrock専用）に依存するためNode.jsで動かない。
// 同等の純関数を自前で実装する。

const STYLE = { color: '#107C10' } // math / green

type Vec3 = { x: number; y: number; z: number }
type Vec2 = { x: number; y: number }

export const 座標を足す: CodeNode = {
  id: 'Vector3Add',
  displayName: '座標を足す',
  menuDisplayName: '座標+',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: 'ベース座標 {x, y, z}' },
    座標B: { description: '加算する座標 {x, y, z}' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標A, 座標B }, { 結果 }) => {
    const a = 座標A as Vec3
    const b = 座標B as Vec3
    結果.next({ x: a.x + (b.x ?? 0), y: a.y + (b.y ?? 0), z: a.z + (b.z ?? 0) })
  },
}

export const 座標を引く: CodeNode = {
  id: 'Vector3Subtract',
  displayName: '座標を引く',
  menuDisplayName: '座標-',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: 'ベース座標 {x, y, z}' },
    座標B: { description: '減算する座標 {x, y, z}' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標A, 座標B }, { 結果 }) => {
    const a = 座標A as Vec3
    const b = 座標B as Vec3
    結果.next({ x: a.x - (b.x ?? 0), y: a.y - (b.y ?? 0), z: a.z - (b.z ?? 0) })
  },
}

export const 座標をスケール: CodeNode = {
  id: 'Vector3Scale',
  displayName: '座標をスケール',
  menuDisplayName: '座標×',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: 'スケールする座標 {x, y, z}' },
    倍率: { description: 'スカラー倍率（例: 2 で2倍）' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標, 倍率 }, { 結果 }) => {
    const v = 座標 as Vec3
    const s = Number(倍率)
    結果.next({ x: v.x * s, y: v.y * s, z: v.z * s })
  },
}

export const 座標間の距離: CodeNode = {
  id: 'Vector3Distance',
  displayName: '座標間の距離',
  menuDisplayName: '距離',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: '始点 {x, y, z}' },
    座標B: { description: '終点 {x, y, z}' },
  },
  outputs: {
    距離: {},
  },
  run: ({ 座標A, 座標B }, { 距離 }) => {
    const a = 座標A as Vec3
    const b = 座標B as Vec3
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
    距離.next(Math.sqrt(dx * dx + dy * dy + dz * dz))
  },
}

export const 座標を切り捨て: CodeNode = {
  id: 'Vector3Floor',
  displayName: '座標を切り捨て',
  menuDisplayName: '座標Floor',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '切り捨てる座標 {x, y, z}' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標 }, { 結果 }) => {
    const v = 座標 as Vec3
    結果.next({ x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) })
  },
}

export const 座標を補間: CodeNode = {
  id: 'Vector3Lerp',
  displayName: '座標を補間',
  menuDisplayName: '座標lerp',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: '始点 {x, y, z}' },
    座標B: { description: '終点 {x, y, z}' },
    割合: { description: '0.0（始点）〜 1.0（終点）。0.5 で中点' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標A, 座標B, 割合 }, { 結果 }) => {
    const a = 座標A as Vec3
    const b = 座標B as Vec3
    const t = Number(割合)
    結果.next({
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      z: a.z + (b.z - a.z) * t,
    })
  },
}

export const 座標を文字列に変換: CodeNode = {
  id: 'Vector3ToString',
  displayName: '座標を文字列に変換',
  menuDisplayName: '座標→文字列',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '変換する座標 {x, y, z}' },
  },
  outputs: {
    文字列: {},
  },
  run: ({ 座標 }, { 文字列 }) => {
    const v = 座標 as Vec3
    文字列.next(`${v.x} ${v.y} ${v.z}`)
  },
}

export const Y座標を補完: CodeNode = {
  id: 'Vector3FromXZ',
  displayName: 'Y座標を補完',
  menuDisplayName: 'XZ→XYZ',
  defaultStyle: STYLE,
  inputs: {
    座標XZ: { description: '2D座標 {x, z}' },
    Y: { description: 'Y座標の値（IIP可）' },
  },
  outputs: {
    座標: {},
  },
  run: ({ 座標XZ, Y }, { 座標 }) => {
    const v = 座標XZ as { x: number; z: number }
    座標.next({ x: v.x, y: Number(Y ?? 64), z: v.z })
  },
}

export const ベクトルの長さ: CodeNode = {
  id: 'Vector3Magnitude',
  displayName: 'ベクトルの長さ',
  menuDisplayName: '座標magnitude',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '長さを求める座標 {x, y, z}' },
  },
  outputs: {
    長さ: {},
  },
  run: ({ 座標 }, { 長さ }) => {
    const v = 座標 as Vec3
    長さ.next(Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z))
  },
}

export const 単位ベクトル化: CodeNode = {
  id: 'Vector3Normalize',
  displayName: '単位ベクトル化',
  menuDisplayName: '座標normalize',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '正規化する座標 {x, y, z}' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 座標 }, { 結果 }) => {
    const v = 座標 as Vec3
    const mag = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
    if (mag === 0) { 結果.next({ x: 0, y: 0, z: 0 }); return }
    結果.next({ x: v.x / mag, y: v.y / mag, z: v.z / mag })
  },
}

export const 数値を範囲に収める: CodeNode = {
  id: 'ClampNumber',
  displayName: '数値を範囲に収める',
  menuDisplayName: '数値Clamp',
  defaultStyle: STYLE,
  inputs: {
    値: { description: 'クランプする数値' },
    最小: { description: '下限値' },
    最大: { description: '上限値' },
  },
  outputs: {
    結果: {},
  },
  run: ({ 値, 最小, 最大 }, { 結果 }) => {
    結果.next(Math.min(Math.max(Number(値), Number(最小)), Number(最大)))
  },
}

// ── Vector2 演算（{x, y} ── 回転角・2D座標）──────────────────────────────

export const 二次元座標を足す: CodeNode = {
  id: 'Vector2Add',
  displayName: '2D座標を足す',
  menuDisplayName: '2D座標+',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: 'ベース2D座標 {x, y}' },
    座標B: { description: '加算する2D座標 {x, y}' },
  },
  outputs: { 結果: {} },
  run: ({ 座標A, 座標B }, { 結果 }) => {
    const a = 座標A as Vec2, b = 座標B as Vec2
    結果.next({ x: a.x + (b.x ?? 0), y: a.y + (b.y ?? 0) })
  },
}

export const 二次元座標を引く: CodeNode = {
  id: 'Vector2Subtract',
  displayName: '2D座標を引く',
  menuDisplayName: '2D座標-',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: 'ベース2D座標 {x, y}' },
    座標B: { description: '減算する2D座標 {x, y}' },
  },
  outputs: { 結果: {} },
  run: ({ 座標A, 座標B }, { 結果 }) => {
    const a = 座標A as Vec2, b = 座標B as Vec2
    結果.next({ x: a.x - (b.x ?? 0), y: a.y - (b.y ?? 0) })
  },
}

export const 二次元座標をスケール: CodeNode = {
  id: 'Vector2Scale',
  displayName: '2D座標をスケール',
  menuDisplayName: '2D座標×',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: 'スケールする2D座標 {x, y}' },
    倍率: { description: 'スカラー倍率' },
  },
  outputs: { 結果: {} },
  run: ({ 座標, 倍率 }, { 結果 }) => {
    const v = 座標 as Vec2, s = Number(倍率)
    結果.next({ x: v.x * s, y: v.y * s })
  },
}

export const 二次元座標間の距離: CodeNode = {
  id: 'Vector2Distance',
  displayName: '2D座標間の距離',
  menuDisplayName: '2D距離',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: '始点 {x, y}' },
    座標B: { description: '終点 {x, y}' },
  },
  outputs: { 距離: {} },
  run: ({ 座標A, 座標B }, { 距離 }) => {
    const a = 座標A as Vec2, b = 座標B as Vec2
    const dx = a.x - b.x, dy = a.y - b.y
    距離.next(Math.sqrt(dx * dx + dy * dy))
  },
}

export const 二次元座標を切り捨て: CodeNode = {
  id: 'Vector2Floor',
  displayName: '2D座標を切り捨て',
  menuDisplayName: '2D座標Floor',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '切り捨てる2D座標 {x, y}' },
  },
  outputs: { 結果: {} },
  run: ({ 座標 }, { 結果 }) => {
    const v = 座標 as Vec2
    結果.next({ x: Math.floor(v.x), y: Math.floor(v.y) })
  },
}

export const 二次元座標を補間: CodeNode = {
  id: 'Vector2Lerp',
  displayName: '2D座標を補間',
  menuDisplayName: '2D座標lerp',
  defaultStyle: STYLE,
  inputs: {
    座標A: { description: '始点 {x, y}' },
    座標B: { description: '終点 {x, y}' },
    割合: { description: '0.0〜1.0（0.5で中点）' },
  },
  outputs: { 結果: {} },
  run: ({ 座標A, 座標B, 割合 }, { 結果 }) => {
    const a = 座標A as Vec2, b = 座標B as Vec2, t = Number(割合)
    結果.next({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })
  },
}

export const 二次元ベクトルの長さ: CodeNode = {
  id: 'Vector2Magnitude',
  displayName: '2Dベクトルの長さ',
  menuDisplayName: '2D magnitude',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '長さを求める2D座標 {x, y}' },
  },
  outputs: { 長さ: {} },
  run: ({ 座標 }, { 長さ }) => {
    const v = 座標 as Vec2
    長さ.next(Math.sqrt(v.x * v.x + v.y * v.y))
  },
}

export const 二次元単位ベクトル化: CodeNode = {
  id: 'Vector2Normalize',
  displayName: '2D単位ベクトル化',
  menuDisplayName: '2D normalize',
  defaultStyle: STYLE,
  inputs: {
    座標: { description: '正規化する2D座標 {x, y}' },
  },
  outputs: { 結果: {} },
  run: ({ 座標 }, { 結果 }) => {
    const v = 座標 as Vec2
    const mag = Math.sqrt(v.x * v.x + v.y * v.y)
    if (mag === 0) { 結果.next({ x: 0, y: 0 }); return }
    結果.next({ x: v.x / mag, y: v.y / mag })
  },
}
