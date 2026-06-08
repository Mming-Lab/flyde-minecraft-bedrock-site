import { CodeNode } from '@flyde/core'
import {
  ServerEvent,
  type MobInteractedSignal,
  type TargetBlockHitSignal,
} from 'socket-be'
import { setCurrentContext } from '../../context-manager'
import { getCurrentWorld } from '../../ws-server'
import { toEnumString } from '../enum-utils'

const STYLE = { color: '#25567D' }

export const OnMobInteracted: CodeNode = {
  id: 'OnMobInteracted',
  displayName: 'OnMobInteracted',
  menuDisplayName: 'OnMobInteracted',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    mob:            { description: 'WorldMob object (interacted mob)' },
    player:         { description: 'WorldPlayer object → pass to player info node' },
    interaction_type: { description: 'Mob interaction type name' },
  },
  run: ({ world }, { mob, player, interaction_type }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: MobInteractedSignal) => {
      setCurrentContext(w, ev.player)
      mob.next(ev.mob)
      player.next(ev.rawPlayer)
      interaction_type.next(toEnumString('MobInteraction', ev.interactionType))
    }
    w.server.on(ServerEvent.MobInteracted, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.MobInteracted, handler))
  },
}

export const OnTargetBlockHit: CodeNode = {
  id: 'OnTargetBlockHit',
  displayName: 'OnTargetBlockHit',
  menuDisplayName: 'OnTargetBlockHit',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    strength: { description: 'Redstone signal level (0–15)' },
    player: { description: 'WorldPlayer object → pass to player info node' },
  },
  run: ({ world }, { strength, player }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: TargetBlockHitSignal) => {
      setCurrentContext(w, ev.player)
      strength.next(ev.redstoneLevel)
      player.next(ev.rawPlayer)
    }
    w.server.on(ServerEvent.TargetBlockHit, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.TargetBlockHit, handler))
  },
}
