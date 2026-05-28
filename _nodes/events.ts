import { CodeNode } from '@flyde/core'
import { ServerEvent, type World } from 'socket-be'

const STYLE = { color: '#25567D' } // events

export const チャット受信: CodeNode = {
  id: 'OnPlayerChat',
  displayName: 'チャット受信',
  menuDisplayName: 'ﾁｬｯﾄ受信',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    送信者: {},
    メッセージ: {},
  },
  run: ({ ワールド }, { 送信者, メッセージ }, adv) => {
    const world = ワールド as World
    const handler = (ev: any) => {
      送信者.next(ev.sender)
      メッセージ.next(ev.message)
    }
    world.server.on(ServerEvent.PlayerChat, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.PlayerChat, handler))
  },
}

export const プレイヤー参加: CodeNode = {
  id: 'OnPlayerJoin',
  displayName: 'プレイヤー参加',
  menuDisplayName: 'ﾌﾟﾚｲﾔｰ参加',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    プレイヤー: {},
  },
  run: ({ ワールド }, { プレイヤー }, adv) => {
    const world = ワールド as World
    const handler = (ev: any) => プレイヤー.next(ev.player)
    world.server.on(ServerEvent.PlayerJoin, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.PlayerJoin, handler))
  },
}

export const プレイヤー退出: CodeNode = {
  id: 'OnPlayerLeave',
  displayName: 'プレイヤー退出',
  menuDisplayName: 'ﾌﾟﾚｲﾔ退出',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    プレイヤー: {},
  },
  run: ({ ワールド }, { プレイヤー }, adv) => {
    const world = ワールド as World
    const handler = (ev: any) => プレイヤー.next(ev.player)
    world.server.on(ServerEvent.PlayerLeave, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.PlayerLeave, handler))
  },
}

export const ブロック破壊: CodeNode = {
  id: 'OnBlockBroken',
  displayName: 'ブロック破壊',
  menuDisplayName: 'ﾌﾞﾛｯｸ破壊',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ワールド: { description: 'Minecraft接続ノードのワールド出力' },
  },
  outputs: {
    プレイヤー: {},
    ブロック種別: {},
  },
  run: ({ ワールド }, { プレイヤー, ブロック種別 }, adv) => {
    const world = ワールド as World
    const handler = (ev: any) => {
      プレイヤー.next(ev.player)
      ブロック種別.next(ev.brokenBlockType)
    }
    world.server.on(ServerEvent.BlockBroken, handler)
    adv.onCleanup(() => world.server.remove(ServerEvent.BlockBroken, handler))
  },
}
