import { CodeNode } from '@flyde/core'

const STYLE = { color: '#767676' }

export const エンティティ情報取得: CodeNode = {
  id: 'GetFromEntity',
  displayName: 'エンティティ情報取得',
  menuDisplayName: 'Entity情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_Entity: { description: 'WorldPlayer または WorldVillager（O_ﾌﾟﾚｲﾔｰ・O_村人 出力）' },
  },
  outputs: {
    座標:         { description: '座標 (position)' },
    向き:         { description: '向き (yRot)' },
    ディメンション: { description: 'ディメンション番号 (dimension)' },
    種別:         { description: '種別文字列 (type)' },
    バリアント:   { description: 'バリアント番号 (variant)' },
    ID:           { description: 'エンティティID番号 (id)' },
  },
  run: ({ O_Entity }, { 座標, 向き, ディメンション, 種別, バリアント, ID }) => {
    const e = O_Entity as any
    座標.next(e.position)
    向き.next(e.yRot)
    ディメンション.next(e.dimension)
    種別.next(e.type)
    バリアント.next(e.variant)
    ID.next(e.id)
  },
}

export const プレイヤー情報取得: CodeNode = {
  id: 'GetFromPlayerSnapshot',
  displayName: 'プレイヤー情報取得',
  menuDisplayName: 'ﾌﾟﾚｲﾔｰ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ﾌﾟﾚｲﾔｰ: { description: 'イベントノードの O_ﾌﾟﾚｲﾔｰ 出力（WorldPlayer オブジェクト）' },
  },
  outputs: {
    名前:     { description: 'プレイヤー名 (name)' },
    カラー:   { description: 'マップマーカーの色 (color)' },
    O_Entity: { description: 'WorldEntity 情報取得ノードへ渡すパススルー出力' },
  },
  run: ({ O_ﾌﾟﾚｲﾔｰ }, { 名前, カラー, O_Entity }) => {
    const p = O_ﾌﾟﾚｲﾔｰ as any
    名前.next(p.name)
    カラー.next(p.color)
    O_Entity.next(p)
  },
}

export const アイテム種別情報取得: CodeNode = {
  id: 'GetFromItemType',
  displayName: 'アイテム種別情報取得',
  menuDisplayName: 'ｱｲﾃﾑ種別情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ｱｲﾃﾑ: { description: 'アイテム種別（アイテム取得・精錬イベントの O_ｱｲﾃﾑ 出力）' },
  },
  outputs: {
    アイテムID: { description: 'アイテムID (id)' },
    データ値:   { description: 'データ値/aux (data)' },
  },
  run: ({ O_ｱｲﾃﾑ }, { アイテムID, データ値 }) => {
    const a = O_ｱｲﾃﾑ as any
    アイテムID.next(a.id)
    データ値.next(a.data)
  },
}

export const 所持アイテム情報取得: CodeNode = {
  id: 'GetFromItemStack',
  displayName: '所持アイテム情報取得',
  menuDisplayName: '所持ｱｲﾃﾑ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ｱｲﾃﾑ: { description: '所持アイテム（使用・装備・クラフト・取引イベントの O_ｱｲﾃﾑ 出力）' },
  },
  outputs: {
    アイテムID: { description: 'アイテムID (typeId)' },
    個数:       { description: '個数 (amount)' },
    最大個数:   { description: 'スタック最大個数 (maxAmount)' },
    データ値:   { description: 'データ値/aux (data)' },
  },
  run: ({ O_ｱｲﾃﾑ }, { アイテムID, 個数, 最大個数, データ値 }) => {
    const a = O_ｱｲﾃﾑ as any
    アイテムID.next(a.typeId)
    個数.next(a.amount)
    最大個数.next(a.maxAmount)
    データ値.next(a.data)
  },
}

export const ブロック情報取得: CodeNode = {
  id: 'GetFromBlockType',
  displayName: 'ブロック情報取得',
  menuDisplayName: 'ﾌﾞﾛｯｸ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ﾌﾞﾛｯｸ: { description: 'BlockType（ブロック・バウンスイベントの O_ﾌﾞﾛｯｸ 出力）' },
  },
  outputs: {
    ブロックID: { description: 'ブロックID (id)' },
    データ値:   { description: 'データ値/aux (data)' },
  },
  run: ({ O_ﾌﾞﾛｯｸ }, { ブロックID, データ値 }) => {
    const b = O_ﾌﾞﾛｯｸ as any
    ブロックID.next(b.id)
    データ値.next(b.data)
  },
}

export const スコアボード目標情報取得: CodeNode = {
  id: 'GetFromScoreboardObjective',
  displayName: 'スコアボード目標情報取得',
  menuDisplayName: 'SB目標情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    目標: { description: 'スコアボード目標追加・取得ノードの 目標 出力' },
  },
  outputs: {
    目標ID: { description: '目標ID (id)' },
    表示名: { description: '表示名 (displayName)' },
  },
  run: ({ 目標 }, { 目標ID, 表示名 }) => {
    const o = 目標 as any
    目標ID.next(o.id)
    表示名.next(o.displayName)
  },
}

export const モブ情報取得: CodeNode = {
  id: 'GetFromMob',
  displayName: 'モブ情報取得',
  menuDisplayName: 'ﾓﾌﾞ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ﾓﾌﾞ: { description: 'モブと交流イベントの O_ﾓﾌﾞ 出力' },
  },
  outputs: {
    種別:       { description: '種別番号 (type)' },
    カラー:     { description: 'カラー番号 (color)' },
    バリアント: { description: 'バリアント番号 (variant)' },
  },
  run: ({ O_ﾓﾌﾞ }, { 種別, カラー, バリアント }) => {
    const m = O_ﾓﾌﾞ as any
    種別.next(m.type)
    カラー.next(m.color)
    バリアント.next(m.variant)
  },
}

export const 村人情報取得: CodeNode = {
  id: 'GetFromVillager',
  displayName: '村人情報取得',
  menuDisplayName: '村人情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_村人: { description: 'WorldVillager（アイテム取引イベントの O_村人 出力）' },
  },
  outputs: {
    名前:     { description: '村人の名前 (trader.name)' },
    ランク:   { description: '取引ランク (trader.tier)' },
    O_Entity: { description: 'エンティティ情報取得ノードへ渡すパススルー出力' },
  },
  run: ({ O_村人 }, { 名前, ランク, O_Entity }) => {
    const v = O_村人 as any
    名前.next(v.trader?.name)
    ランク.next(v.trader?.tier)
    O_Entity.next(v)
  },
}
