import { CodeNode } from '@flyde/core'
import {
  ServerEvent,
  type PlayerBouncedSignal,
  type PlayerChatSignal,
  type PlayerJoinSignal,
  type PlayerLeaveSignal,
  type PlayerMessageSignal,
  type PlayerTeleportedSignal,
  type PlayerTitleSignal,
  type PlayerTransformSignal,
  type PlayerTravelledSignal,
} from 'socket-be'
import { setCurrentContext } from '../../context-manager'
import { getCurrentWorld } from '../../ws-server'
import { toEnumString } from '../enum-utils'

const STYLE = { color: '#25567D' }

export const OnPlayerChat: CodeNode = {
  id: 'OnPlayerChat',
  displayName: 'OnPlayerChat',
  menuDisplayName: 'OnPlayerChat',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    sender:  { description: 'Player name who sent the chat' },
    message: { description: 'Chat message content' },
  },
  run: ({ world }, { sender, message }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerChatSignal) => {
      setCurrentContext(w, ev.sender)
      sender.next(ev.sender.name)
      message.next(ev.message)
    }
    w.server.on(ServerEvent.PlayerChat, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerChat, handler))
  },
}

export const OnPlayerJoin: CodeNode = {
  id: 'OnPlayerJoin',
  displayName: 'OnPlayerJoin',
  menuDisplayName: 'OnPlayerJoin',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    player_name: { description: 'Name of the player who joined' },
  },
  run: ({ world }, { player_name }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerJoinSignal) => {
      setCurrentContext(w, ev.player)
      player_name.next(ev.player.name)
    }
    w.server.on(ServerEvent.PlayerJoin, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerJoin, handler))
  },
}

export const OnPlayerLeave: CodeNode = {
  id: 'OnPlayerLeave',
  displayName: 'OnPlayerLeave',
  menuDisplayName: 'OnPlayerLeave',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    player_name: { description: 'Name of the player who left' },
  },
  run: ({ world }, { player_name }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerLeaveSignal) => {
      setCurrentContext(w, ev.player)
      player_name.next(ev.player.name)
    }
    w.server.on(ServerEvent.PlayerLeave, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerLeave, handler))
  },
}

export const OnPlayerTravelled: CodeNode = {
  id: 'OnPlayerTravelled',
  displayName: 'OnPlayerTravelled',
  menuDisplayName: 'OnPlayerTravelled',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    distance:      { description: 'Distance travelled (meters)' },
    player:      { description: 'WorldPlayer object → pass to player info node' },
    underwater:    { description: 'Whether travelling underwater (true/false)' },
    biome:         { description: 'Current biome name' },
    travel_method: { description: 'Travel method name' },
  },
  run: ({ world }, { distance, player, underwater, biome, travel_method }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerTravelledSignal) => {
      setCurrentContext(w, ev.player)
      distance.next(ev.metersTravelled)
      player.next(ev.rawPlayer)
      underwater.next(ev.isUnderwater)
      biome.next(toEnumString('biome', ev.newBiome))
      travel_method.next(toEnumString('TravelMethod', ev.travelMethod))
    }
    w.server.on(ServerEvent.PlayerTravelled, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerTravelled, handler))
  },
}

export const OnPlayerTeleported: CodeNode = {
  id: 'OnPlayerTeleported',
  displayName: 'OnPlayerTeleported',
  menuDisplayName: 'OnPlayerTeleported',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    player:      { description: 'WorldPlayer object → pass to player info node' },
    teleport_cause: { description: 'Teleportation cause name' },
    distance:      { description: 'Teleportation distance (meters)' },
  },
  run: ({ world }, { player, teleport_cause, distance }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerTeleportedSignal) => {
      setCurrentContext(w, ev.player)
      player.next(ev.rawPlayer)
      teleport_cause.next(toEnumString('TeleportCause', ev.cause))
      distance.next(ev.metersTravelled)
    }
    w.server.on(ServerEvent.PlayerTeleported, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerTeleported, handler))
  },
}

export const OnPlayerTitle: CodeNode = {
  id: 'OnPlayerTitle',
  displayName: 'OnPlayerTitle',
  menuDisplayName: 'OnPlayerTitle',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    sender:    { description: 'Player name who sent the title' },
    message:   { description: 'Title message content' },
    recipient: { description: 'Player name who received the title' },
  },
  run: ({ world }, { sender, message, recipient }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerTitleSignal) => {
      setCurrentContext(w, ev.sender)
      sender.next(ev.sender.name)
      message.next(ev.message)
      recipient.next(ev.receiver.name)
    }
    w.server.on(ServerEvent.PlayerTitle, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerTitle, handler))
  },
}

export const OnPlayerMessage: CodeNode = {
  id: 'OnPlayerMessage',
  displayName: 'OnPlayerMessage',
  menuDisplayName: 'OnPlayerMessage',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    sender:    { description: 'Player name who sent the message' },
    message:   { description: 'Message content' },
    type:      { description: 'Message type (chat / tell etc.)' },
    recipient: { description: '[nullable] Recipient name. null for non-tell messages' },
  },
  run: ({ world }, { sender, message, type, recipient }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerMessageSignal) => {
      setCurrentContext(w, ev.sender)
      sender.next(ev.sender.name)
      message.next(ev.message)
      type.next(ev.type)
      recipient.next(ev.receiver?.name ?? null)
    }
    w.server.on(ServerEvent.PlayerMessage, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerMessage, handler))
  },
}

export const OnPlayerBounced: CodeNode = {
  id: 'OnPlayerBounced',
  displayName: 'OnPlayerBounced',
  menuDisplayName: 'OnPlayerBounced',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    height:   { description: 'Bounce height (blocks)' },
    block:  { description: 'BlockType object (block bounced on) → pass to block info node' },
    player: { description: 'WorldPlayer object → pass to player info node' },
  },
  run: ({ world }, { height, block, player }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerBouncedSignal) => {
      setCurrentContext(w, ev.player)
      height.next(ev.bounceHeight)
      block.next(ev.blockType)
      player.next(ev.rawPlayer)
    }
    w.server.on(ServerEvent.PlayerBounced, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerBounced, handler))
  },
}

export const OnPlayerTransform: CodeNode = {
  id: 'OnPlayerTransform',
  displayName: 'OnPlayerTransform',
  menuDisplayName: 'OnPlayerTransform',
  icon: 'bolt',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    world: { description: 'World output from MinecraftConnect node' },
  },
  outputs: {
    position:  { description: 'Player position {x,y,z} (fires every tick while moving)' },
    direction: { description: 'Player yaw rotation' },
    player:    { description: 'WorldPlayer object → pass to player info node' },
  },
  run: ({ world }, { position, direction, player }, adv) => {
    const w = getCurrentWorld()!
    const handler = (ev: PlayerTransformSignal) => {
      setCurrentContext(w, ev.player)
      position.next(ev.rawPlayer.position)
      direction.next(ev.rawPlayer.yRot)
      player.next(ev.rawPlayer)
    }
    w.server.on(ServerEvent.PlayerTransform, handler)
    adv.onCleanup(() => w.server.remove(ServerEvent.PlayerTransform, handler))
  },
}
