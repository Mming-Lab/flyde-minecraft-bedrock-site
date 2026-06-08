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
    position:  {},
    direction: {},
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
    angle: {},
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
  outputs: { tags: {} },
  run: async (_, { tags }) => {
    const { player } = getCurrentContext()
    tags.next(await player.getTags())
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
  outputs: { result: {} },
  run: async ({ tag }, { result }) => {
    const { player } = getCurrentContext()
    result.next(await player.hasTag(String(tag)))
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
  outputs: { level: {} },
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
  outputs: { game_mode: {} },
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
  outputs: { abilities: {} },
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
  outputs: { players: {} },
  run: async (_, { players }) => {
    const { world } = getCurrentContext()
    players.next(await world.getPlayers())
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
  outputs: { player: {} },
  run: async (_, { player }) => {
    const { world } = getCurrentContext()
    player.next(await world.getLocalPlayer())
  },
}

export const GiveItem: CodeNode = {
  id: 'GiveItem',
  displayName: 'GiveItem',
  menuDisplayName: 'GiveItem',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    item_id:  { description: 'Item ID (e.g. minecraft:diamond)' },
    amount:   { description: 'Amount to give', defaultValue: 1 },
  },
  outputs: { done: {} },
  run: async ({ item_id, amount }, { done }) => {
    const { player } = getCurrentContext()
    await player.giveItem(String(item_id), Number(amount))
    done.next(true)
  },
}

// --- server tier ---

export const AddPlayerLevel: CodeNode = {
  id: 'AddPlayerLevel',
  displayName: 'AddPlayerLevel',
  menuDisplayName: 'AddPlayerLevel',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    level:   { description: 'Levels to add (negative to subtract)', defaultValue: 1 },
  },
  outputs: { done: {} },
  run: async ({ level }, { done }) => {
    const { player } = getCurrentContext()
    await player.addLevel(Number(level))
    done.next(true)
  },
}

export const SetGameMode: CodeNode = {
  id: 'SetGameMode',
  displayName: 'SetGameMode',
  menuDisplayName: 'SetGameMode',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    mode: {
      description: 'Game mode to set',
      defaultValue: 'Survival',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Survival',  value: 'Survival' },
          { label: 'Creative',  value: 'Creative' },
          { label: 'Adventure', value: 'Adventure' },
          { label: 'Spectator', value: 'Spectator' },
        ],
      },
    },
  },
  outputs: { done: {} },
  run: async ({ mode }, { done }) => {
    const { player } = getCurrentContext()
    await player.setGameMode(mode as any)
    done.next(true)
  },
}

export const UpdateAbility: CodeNode = {
  id: 'UpdateAbility',
  displayName: 'UpdateAbility',
  menuDisplayName: 'UpdateAbility',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    ability: {
      description: 'Ability type',
      defaultValue: 'mayfly',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Mayfly',       value: 'mayfly' },
          { label: 'Mute',         value: 'mute' },
          { label: 'Worldbuilder', value: 'worldbuilder' },
        ],
      },
    },
    value: { description: 'Enable (true) or disable (false)', defaultValue: true },
  },
  outputs: { done: {} },
  run: async ({ ability, value }, { done }) => {
    const { player } = getCurrentContext()
    await player.updateAbility(ability as any, Boolean(value))
    done.next(true)
  },
}

export const SetTitle: CodeNode = {
  id: 'SetTitle',
  displayName: 'SetTitle',
  menuDisplayName: 'SetTitle',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    title:    { description: 'Title text (large center text)' },
    subtitle: { description: 'Subtitle text (below title, optional)', defaultValue: '' },
  },
  outputs: { done: {} },
  run: async ({ title, subtitle }, { done }) => {
    const { player } = getCurrentContext()
    const opts = subtitle ? { subtitle: String(subtitle) } : undefined
    await player.onScreenDisplay.setTitle(String(title), opts)
    done.next(true)
  },
}

export const SetActionBar: CodeNode = {
  id: 'SetActionBar',
  displayName: 'SetActionBar',
  menuDisplayName: 'SetActionBar',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    text:    { description: 'Action bar text (small text above hotbar)' },
  },
  outputs: { done: {} },
  run: async ({ text }, { done }) => {
    const { player } = getCurrentContext()
    await player.onScreenDisplay.setActionBar(String(text))
    done.next(true)
  },
}

export const ClearTitle: CodeNode = {
  id: 'ClearTitle',
  displayName: 'ClearTitle',
  menuDisplayName: 'ClearTitle',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { done: {} },
  run: async (_, { done }) => {
    const { player } = getCurrentContext()
    await player.onScreenDisplay.clearTitle()
    done.next(true)
  },
}
