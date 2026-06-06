import { CodeNode } from '@flyde/core'
import { BLOCK_JA, ITEM_JA, MOB_JA, ENUM_JA } from './_catalog'

const STYLE = { color: '#767676' }

export const 日本語変換: CodeNode = {
  id: 'ToJa',
  displayName: '日本語変換',
  menuDisplayName: '日本語変換',
  icon: 'language',
  defaultStyle: STYLE,
  inputs: {
    値: { description: 'Minecraft ID（"minecraft:stone" など）またはイベント値（"Walk" など）' },
    種別: {
      description: 'どの種別として変換するか（IDの場合は最初に検索する辞書になる）',
      defaultValue: 'ブロック',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'ブロックID',       value: 'ブロック' },
          { label: 'アイテムID',       value: 'アイテム' },
          { label: 'モブID',           value: 'モブ' },
          { label: '移動方法',         value: '移動方法' },
          { label: 'テレポート原因',   value: 'テレポート原因' },
          { label: 'モブ交流種別',     value: 'モブ交流' },
          { label: 'アイテム使用方法', value: 'アイテム使用' },
          { label: 'アイテム取得方法', value: 'アイテム取得' },
          { label: '装備スロット',     value: '装備スロット' },
          { label: 'ブロック破壊方法', value: '破壊方法' },
          { label: 'ブロック設置方法', value: '設置方法' },
        ],
      },
    },
  },
  outputs: {
    日本語名: { description: '日本語に変換した名前（見つからない場合は入力値をそのまま返す）' },
  },
  run: ({ 値, 種別 }, { 日本語名 }) => {
    const v = String(値)
    const k = String(種別)
    let result: string | undefined
    if (k === 'ブロック' || k === 'アイテム' || k === 'モブ') {
      const order = k === 'アイテム' ? [ITEM_JA, BLOCK_JA, MOB_JA]
                  : k === 'モブ'     ? [MOB_JA,  ITEM_JA,  BLOCK_JA]
                  :                    [BLOCK_JA, ITEM_JA,  MOB_JA]
      result = order.reduce<string | undefined>((found, map) => found ?? map[v], undefined)
    } else {
      result = (ENUM_JA[k] ?? {})[v]
    }
    日本語名.next(result ?? v)
  },
}
