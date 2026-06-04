import { CodeNode } from '@flyde/core'
import {
  TravelMethod,
  TeleportationCause,
  MobInteractionType,
  ItemInteractMethod,
  ItemAcquisitionMethod,
  PlayerEquipmentSlot,
} from 'socket-be'

const STYLE = { color: '#767676' } // utility

// 数値 enum を「値 → キー名」に逆引きするヘルパー
function enumKeyName(enumObj: Record<string, string | number>, value: number): string {
  const entry = Object.entries(enumObj).find(([, v]) => v === value)
  return entry ? entry[0] : String(value)
}

// socket-be に enum 定義がない数値フィールド用マッピング
// Bedrock プロトコルの BlockDestroyedByPlayer / BlockPlaced パケット仕様に基づく
const DESTRUCTION_METHOD: Record<number, string> = {
  0: 'Player',
  1: 'Explosion',
  2: 'Mob',
  3: 'Piston',
  4: 'Other',
}
const PLACEMENT_METHOD: Record<number, string> = {
  0: 'Player',
  1: 'Other',
}

// Bedrock Edition バイオーム数値 ID → 名称
// 出典: Bedrock プロトコル仕様 / LeviLamina / @minecraft/vanilla-data の MinecraftBiomeTypes
// バージョンによって一部 ID が異なる場合あり
const BIOME_NAMES: Record<number, string> = {
  0:   'Ocean',
  1:   'Plains',
  2:   'Desert',
  3:   'ExtremeHills',
  4:   'Forest',
  5:   'Taiga',
  6:   'Swampland',
  7:   'River',
  8:   'Hell',
  9:   'TheEnd',
  10:  'LegacyFrozenOcean',
  11:  'FrozenRiver',
  12:  'IcePlains',
  13:  'IceMountains',
  14:  'MushroomIsland',
  15:  'MushroomIslandShore',
  16:  'Beach',
  17:  'DesertHills',
  18:  'ForestHills',
  19:  'TaigaHills',
  20:  'ExtremeHillsEdge',
  21:  'Jungle',
  22:  'JungleHills',
  23:  'JungleEdge',
  24:  'DeepOcean',
  25:  'StoneBeach',
  26:  'ColdBeach',
  27:  'BirchForest',
  28:  'BirchForestHills',
  29:  'RoofedForest',
  30:  'ColdTaiga',
  31:  'ColdTaigaHills',
  32:  'MegaTaiga',
  33:  'MegaTaigaHills',
  34:  'ExtremeHillsPlusTrees',
  35:  'Savanna',
  36:  'SavannaPlateau',
  37:  'Mesa',
  38:  'MesaPlateauStone',
  39:  'MesaPlateau',
  40:  'WarmOcean',
  41:  'LukewarmOcean',
  42:  'ColdOcean',
  43:  'DeepWarmOcean',
  44:  'DeepLukewarmOcean',
  45:  'DeepColdOcean',
  46:  'DeepFrozenOcean',
  47:  'FrozenPeaks',
  48:  'SnowySlopes',
  49:  'StonyPeaks',
  50:  'JaggedPeaks',
  51:  'Meadow',
  52:  'Grove',
  53:  'LushCaves',
  54:  'DripstoneCaves',
  55:  'DeepDark',
  56:  'MangroveSwamp',
  57:  'CherryGrove',
  58:  'PaleGarden',
  129: 'SunflowerPlains',
  130: 'DesertMutated',
  131: 'ExtremeHillsMutated',
  132: 'FlowerForest',
  133: 'TaigaMutated',
  134: 'SwamplandMutated',
  140: 'IcePlainsSpikes',
  149: 'JungleMutated',
  151: 'JungleEdgeMutated',
  155: 'BirchForestMutated',
  156: 'BirchForestHillsMutated',
  157: 'RoofedForestMutated',
  158: 'ColdTaigaMutated',
  160: 'RedwoodTaigaMutated',
  161: 'RedwoodTaigaHillsMutated',
  162: 'ExtremeHillsPlusTreesMutated',
  163: 'SavannaMutated',
  164: 'SavannaPlateauMutated',
  165: 'MesaBryce',
  166: 'MesaPlateauStoneMutated',
  167: 'MesaPlateauMutated',
  168: 'BambooJungle',
  169: 'BambooJungleHills',
  177: 'SoulsandValley',
  178: 'CrimsonForest',
  179: 'WarpedForest',
  180: 'BasaltDeltas',
}

export const イベントenum名称変換: CodeNode = {
  id: 'GetEventEnumName',
  displayName: 'イベント数値→名称',
  menuDisplayName: 'enum名称変換',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    数値: { description: 'イベントノードの E_ ポート出力' },
    種別: {
      description: '変換するenum種別',
      defaultValue: 'travelMethod',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: '移動方法 (TravelMethod)',             value: 'travelMethod' },
          { label: 'テレポート原因 (TeleportationCause)', value: 'teleportationCause' },
          { label: 'モブ交流種別 (MobInteractionType)',    value: 'mobInteractionType' },
          { label: 'アイテム取得方法 (AcquisitionMethod)', value: 'acquisitionMethod' },
          { label: 'アイテム使用方法 (InteractMethod)',    value: 'interactMethod' },
          { label: '装備スロット (EquipmentSlot)',         value: 'equipmentSlot' },
          { label: 'ブロック破壊方法 (DestructionMethod)', value: 'destructionMethod' },
          { label: 'ブロック設置方法 (PlacementMethod)',   value: 'placementMethod' },
          { label: 'バイオーム (BiomeId)',                  value: 'biome' },
        ]
      }
    }
  },
  outputs: { 名称: {} },
  run: ({ 数値, 種別 }, { 名称 }) => {
    const n = Number(数値)
    const kind = String(種別)
    let result: string
    switch (kind) {
      case 'travelMethod':       result = enumKeyName(TravelMethod as any, n); break
      case 'teleportationCause': result = enumKeyName(TeleportationCause as any, n); break
      case 'mobInteractionType': result = enumKeyName(MobInteractionType as any, n); break
      case 'acquisitionMethod':  result = enumKeyName(ItemAcquisitionMethod as any, n); break
      case 'interactMethod':     result = enumKeyName(ItemInteractMethod as any, n); break
      case 'equipmentSlot':      result = enumKeyName(PlayerEquipmentSlot as any, n); break
      case 'destructionMethod':  result = DESTRUCTION_METHOD[n] ?? String(n); break
      case 'placementMethod':    result = PLACEMENT_METHOD[n] ?? String(n); break
      case 'biome':              result = BIOME_NAMES[n] ?? String(n); break
      default:                   result = String(n)
    }
    名称.next(result)
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
    項目: {
      description: '取得する情報',
      defaultValue: 'name',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: '名前',           value: 'name' },
          { label: '座標 (Vector3)', value: 'position' },
          { label: '向き (yRot)',    value: 'yRot' },
          { label: 'ディメンション', value: 'dimension' },
          { label: 'uniqueId',       value: 'uniqueId' },
        ]
      }
    }
  },
  outputs: { 値: {} },
  run: ({ O_ﾌﾟﾚｲﾔｰ, 項目 }, { 値 }) => {
    値.next((O_ﾌﾟﾚｲﾔｰ as any)[項目 as string])
  }
}

export const アイテム種別情報取得: CodeNode = {
  id: 'GetFromItemType',
  displayName: 'アイテム種別情報取得',
  menuDisplayName: 'ｱｲﾃﾑ種別情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ｱｲﾃﾑ: { description: 'アイテム種別（アイテム取得・精錬イベントの O_ｱｲﾃﾑ 出力）' },
    項目: {
      description: '取得する情報',
      defaultValue: 'id',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'アイテムID', value: 'id' },
          { label: 'データ値',   value: 'data' },
        ]
      }
    }
  },
  outputs: { 値: {} },
  run: ({ O_ｱｲﾃﾑ, 項目 }, { 値 }) => {
    値.next((O_ｱｲﾃﾑ as any)[項目 as string])
  }
}

export const 所持アイテム情報取得: CodeNode = {
  id: 'GetFromItemStack',
  displayName: '所持アイテム情報取得',
  menuDisplayName: '所持ｱｲﾃﾑ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ｱｲﾃﾑ: { description: '所持アイテム（使用・装備・クラフト・取引イベントの O_ｱｲﾃﾑ 出力）' },
    項目: {
      description: '取得する情報',
      defaultValue: 'typeId',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'アイテムID', value: 'typeId' },
          { label: '個数',       value: 'amount' },
          { label: '最大個数',   value: 'maxAmount' },
          { label: 'データ値',   value: 'data' },
        ]
      }
    }
  },
  outputs: { 値: {} },
  run: ({ O_ｱｲﾃﾑ, 項目 }, { 値 }) => {
    値.next((O_ｱｲﾃﾑ as any)[項目 as string])
  }
}

export const ブロック情報取得: CodeNode = {
  id: 'GetFromBlockType',
  displayName: 'ブロック情報取得',
  menuDisplayName: 'ﾌﾞﾛｯｸ情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_ﾌﾞﾛｯｸ: { description: 'BlockType（ブロック・バウンスイベントの O_ﾌﾞﾛｯｸ 出力）' },
    項目: {
      description: '取得する情報',
      defaultValue: 'id',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'ブロックID', value: 'id' },
          { label: 'データ値',   value: 'data' },
        ]
      }
    }
  },
  outputs: { 値: {} },
  run: ({ O_ﾌﾞﾛｯｸ, 項目 }, { 値 }) => {
    値.next((O_ﾌﾞﾛｯｸ as any)[項目 as string])
  }
}

export const 村人情報取得: CodeNode = {
  id: 'GetFromVillager',
  displayName: '村人情報取得',
  menuDisplayName: '村人情報',
  icon: 'shuffle',
  defaultStyle: STYLE,
  inputs: {
    O_村人: { description: 'WorldVillager（アイテム取引イベントの O_村人 出力）' },
    項目: {
      description: '取得する情報',
      defaultValue: 'trader.name',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: '名前',   value: 'trader.name' },
          { label: 'ランク', value: 'trader.tier' },
          { label: '座標',   value: 'position' },
          { label: '向き',   value: 'yRot' },
        ]
      }
    }
  },
  outputs: { 値: {} },
  run: ({ O_村人, 項目 }, { 値 }) => {
    const parts = String(項目).split('.')
    let result: any = O_村人
    for (const p of parts) result = result?.[p]
    値.next(result)
  }
}
