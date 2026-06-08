import { CodeNode } from '@flyde/core'
import {
  ServerEvent,
  type BlockBrokenSignal,
  type BlockPlacedSignal,
} from 'socket-be'
import { setCurrentContext } from '../../context-manager'
import { getCurrentWorld } from '../../ws-server'
import { toEnumString } from '../enum-utils'

const STYLE = { color: '#25567D' }

export const OnBlockBroken: CodeNode = {
  id: 'OnBlockBroken',
  displayName: 'OnBlockBroken',
  menuDisplayName: 'OnBlockBroken',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    block:        { description: 'BlockType object → pass to block info node' },
    player:       { description: 'WorldPlayer object → pass to player info node' },
    destroy_method: { description: 'Block destruction method name' },
    item:         { description: '[nullable] Held item before breaking. null if bare-handed' },
  },
  run: ({ world }, { block, player, destroy_method, item }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: BlockBrokenSignal) => {
      setCurrentContext(w, ev.player)
      block.next(ev.brokenBlockType)
      player.next(ev.rawPlayer)
      destroy_method.next(toEnumString('BlockBreakMethod', ev.destructionMethod))
      item.next(ev.itemStackBeforeBreak ?? null)
    }
    w.server.on(ServerEvent.BlockBroken, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.BlockBroken, handler))
  },
}

export const OnBlockPlaced: CodeNode = {
  id: 'OnBlockPlaced',
  displayName: 'OnBlockPlaced',
  menuDisplayName: 'OnBlockPlaced',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    block:       { description: 'BlockType object → pass to block info node' },
    player:      { description: 'WorldPlayer object → pass to player info node' },
    underwater:    { description: 'Whether placed underwater (true/false)' },
    place_method:  { description: 'Block placement method name' },
    item:        { description: 'Held item before placing → pass to item info node' },
  },
  run: ({ world }, { block, player, underwater, place_method, item }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: BlockPlacedSignal) => {
      setCurrentContext(w, ev.player)
      block.next(ev.placedBlockType)
      player.next(ev.rawPlayer)
      underwater.next(ev.placedUnderwater)
      place_method.next(toEnumString('BlockPlaceMethod', ev.placementMethod))
      item.next(ev.itemStackBeforePlace)
    }
    w.server.on(ServerEvent.BlockPlaced, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.BlockPlaced, handler))
  },
}
