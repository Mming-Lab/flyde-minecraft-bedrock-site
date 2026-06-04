import { CodeNode } from '@flyde/core'
import {
  ServerEvent,
  type World,
  type BlockBrokenSignal,
  type BlockPlacedSignal,
} from 'socket-be'
import { setCurrentContext } from '../context-manager'

const STYLE = { color: '#25567D' }

export const ブロック破壊: CodeNode = {
  id: 'OnBlockBroken',
  displayName: 'ブロック破壊',
  menuDisplayName: 'ﾌﾞﾛｯｸ破壊',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    O_ﾌﾞﾛｯｸ: { description: 'BlockType オブジェクト → ブロック情報取得ノードへ' },
    O_ﾌﾟﾚｲﾔｰ: { description: 'WorldPlayer オブジェクト → プレイヤー情報取得ノードへ' },
    E_破壊方法: { description: '破壊方法の数値コード（Enum）→ enum名称変換ノードへ' },
    O_ｱｲﾃﾑ: { description: '【null許容】所持アイテム（破壊前に持っていたアイテム）。素手のとき null → Conditional(EXISTS)で分岐' },
  },
  run: ({ ワールド }, { O_ﾌﾞﾛｯｸ, O_ﾌﾟﾚｲﾔｰ, E_破壊方法, O_ｱｲﾃﾑ }, adv) => {
    const world = ワールド as World
    const handler = (ev: BlockBrokenSignal) => {
      setCurrentContext(world, ev.player)
      O_ﾌﾞﾛｯｸ.next(ev.brokenBlockType)
      O_ﾌﾟﾚｲﾔｰ.next(ev.rawPlayer)
      E_破壊方法.next(ev.destructionMethod)
      O_ｱｲﾃﾑ.next(ev.itemStackBeforeBreak ?? null)
    }
    world.server.on(ServerEvent.BlockBroken, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.BlockBroken, handler))
  },
}

export const ブロック設置イベント: CodeNode = {
  id: 'OnBlockPlaced',
  displayName: 'ブロック設置イベント',
  menuDisplayName: 'ﾌﾞﾛｯｸ設置イベント',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    O_ﾌﾞﾛｯｸ: { description: 'BlockType オブジェクト → ブロック情報取得ノードへ' },
    O_ﾌﾟﾚｲﾔｰ: { description: 'WorldPlayer オブジェクト → プレイヤー情報取得ノードへ' },
    水中: { description: '水中に設置したか（true/false）' },
    E_設置方法: { description: '設置方法の数値コード（Enum）→ enum名称変換ノードへ' },
    O_ｱｲﾃﾑ: { description: '所持アイテム（設置前に持っていたアイテム）→ 所持アイテム情報取得ノードへ' },
  },
  run: ({ ワールド }, { O_ﾌﾞﾛｯｸ, O_ﾌﾟﾚｲﾔｰ, 水中, E_設置方法, O_ｱｲﾃﾑ }, adv) => {
    const world = ワールド as World
    const handler = (ev: BlockPlacedSignal) => {
      setCurrentContext(world, ev.player)
      O_ﾌﾞﾛｯｸ.next(ev.placedBlockType)
      O_ﾌﾟﾚｲﾔｰ.next(ev.rawPlayer)
      水中.next(ev.placedUnderwater)
      E_設置方法.next(ev.placementMethod)
      O_ｱｲﾃﾑ.next(ev.itemStackBeforePlace)
    }
    world.server.on(ServerEvent.BlockPlaced, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.BlockPlaced, handler))
  },
}
