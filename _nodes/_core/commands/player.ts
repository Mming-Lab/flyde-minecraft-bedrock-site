import { CodeNode } from '@flyde/core'
import { getCurrentContext } from '../../context-manager'

const STYLE = { color: '#0078D7' }

export const GetPlayerLocation: CodeNode = {
  id: 'GetPlayerLocation',
  displayName: 'GetPlayerLocation',
  menuDisplayName: 'GetPlayerLocation',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: {
    position:  { description: 'Player position {x,y,z}' },
    direction: { description: 'Look direction vector {x,y,z}' },
  },
  run: async (_, { position, direction }) => {
    const { player } = getCurrentContext()
    const result = await player.query()
    position.next(result.position)
    direction.next(result.yRot)
  },
}

export const GetPlayerOrientation: CodeNode = {
  id: 'GetPlayerOrientation',
  displayName: 'GetPlayerOrientation',
  menuDisplayName: 'GetPlayerOrientation',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: {
    angle: { description: 'Player yaw angle (degrees)' },
  },
  run: async (_, { angle }) => {
    const { player } = getCurrentContext()
    const result = await player.query()
    angle.next(result.yRot)
  },
}

export const GetPlayerTags: CodeNode = {
  id: 'GetPlayerTags',
  displayName: 'GetPlayerTags',
  menuDisplayName: 'GetPlayerTags',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { tags: { description: 'Array of tag strings attached to the player' } },
  run: async (_, { tags }) => {
    const { world, player } = getCurrentContext()
    // socket-be の getTags() はタグが0個のとき match() が null を返し TypeError になるため直接実装する
    const res = await world.runCommand(`tag "${player.name}" list`)
    const matches = res.statusMessage.match(/§a.*?§r/g) ?? []
    tags.next(matches.map((s: string) => s.replace(/§a|§r/g, '')))
  },
}

export const PlayerHasTag: CodeNode = {
  id: 'PlayerHasTag',
  displayName: 'PlayerHasTag',
  menuDisplayName: 'PlayerHasTag',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    tag:     { description: 'Tag name to check' },
  },
  outputs: { result: { description: 'true if the player has the tag' } },
  run: async ({ tag }, { result }) => {
    const { player } = getCurrentContext()
    try {
      result.next(await player.hasTag(String(tag)))
    } catch (e) {
      // socket-be の getTags() はタグ0件のとき match() が null を返し TypeError になる
      if (e instanceof TypeError) result.next(false)
      else throw e
    }
  },
}

export const GetPlayerLevel: CodeNode = {
  id: 'GetPlayerLevel',
  displayName: 'GetPlayerLevel',
  menuDisplayName: 'GetPlayerLevel',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { level: { description: 'Player XP level' } },
  run: async (_, { level }) => {
    const { player } = getCurrentContext()
    level.next(await player.getLevel())
  },
}

export const GetGameMode: CodeNode = {
  id: 'GetGameMode',
  displayName: 'GetGameMode',
  menuDisplayName: 'GetGameMode',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { game_mode: { description: 'Game mode name (Survival / Creative / Adventure / Spectator)' } },
  run: async (_, { game_mode }) => {
    const { player } = getCurrentContext()
    game_mode.next(await player.getGameMode())
  },
}

export const GetPlayerAbilities: CodeNode = {
  id: 'GetPlayerAbilities',
  displayName: 'GetPlayerAbilities',
  menuDisplayName: 'GetPlayerAbilities',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { abilities: { description: 'Player abilities object' } },
  run: async (_, { abilities }) => {
    const { player } = getCurrentContext()
    abilities.next(await player.getAbilities())
  },
}

export const GetPlayers: CodeNode = {
  id: 'GetPlayers',
  displayName: 'GetPlayers',
  menuDisplayName: 'GetPlayers',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { players: { description: 'Array of player name strings' } },
  run: async (_, { players }) => {
    const { world } = getCurrentContext()
    const list = await world.getPlayers()
    players.next(list.map((p: any) => p.rawName ?? p.name))
  },
}

export const GetLocalPlayer: CodeNode = {
  id: 'GetLocalPlayer',
  displayName: 'GetLocalPlayer',
  menuDisplayName: 'GetLocalPlayer',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { player: { description: 'WorldPlayer snapshot of the local player' } },
  run: async (_, { player }) => {
    const { world } = getCurrentContext()
    const localPlayer = await world.getLocalPlayer()
    const snapshot = await localPlayer.query()
    player.next({ ...snapshot, name: localPlayer.rawName })
  },
}

