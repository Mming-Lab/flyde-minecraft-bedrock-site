import { CodeNode } from '@flyde/core'
import { getCurrentContext } from '../../context-manager'
import { getCurrentWorld } from '../../ws-server'

const STYLE = { color: '#8F6D40' }

export const RunCommand: CodeNode = {
  id: 'RunCommand',
  displayName: 'RunCommand',
  menuDisplayName: 'RunCommand',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    command:  { description: 'Minecraft command to run (without /)' },
  },
  outputs: {
    done: {},
  },
  run: async ({ command }, { done }) => {
    const { world } = getCurrentContext()
    await world.runCommand(command)
    done.next(true)
  },
}

export const GetGameTime: CodeNode = {
  id: 'GetGameTime',
  displayName: 'GetGameTime',
  menuDisplayName: 'GetGameTime',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    type: {
      description: 'Time type to retrieve',
      defaultValue: 'time',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Time (0–24000)', value: 'time' },
          { label: 'Day count',      value: 'day' },
          { label: 'Tick count',     value: 'tick' },
        ],
      },
    },
  },
  outputs: { value: {} },
  run: async ({ type }, { value }) => {
    const { world } = getCurrentContext()
    const k = String(type)
    if      (k === 'time') value.next(await world.getTimeOfDay())
    else if (k === 'day')  value.next(await world.getDay())
    else if (k === 'tick') value.next(await world.getCurrentTick())
  },
}

export const IsDaytime: CodeNode = {
  id: 'IsDaytime',
  displayName: 'IsDaytime',
  menuDisplayName: 'IsDaytime',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: {
    is_day: {},
  },
  run: async (_, { is_day }) => {
    const { world } = getCurrentContext()
    const t = await world.getTimeOfDay()
    is_day.next(t < 12000)
  },
}

export const GetWeather: CodeNode = {
  id: 'GetWeather',
  displayName: 'GetWeather',
  menuDisplayName: 'GetWeather',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { weather: {} },
  run: async (_, { weather }) => {
    const { world } = getCurrentContext()
    weather.next(await world.getWeather())
  },
}

export const FillBlocks: CodeNode = {
  id: 'FillBlocks',
  displayName: 'FillBlocks',
  menuDisplayName: 'FillBlocks',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    from:     { description: 'Start position {x, y, z}' },
    to:       { description: 'End position {x, y, z}' },
    block_id: { description: 'Block ID (e.g. minecraft:stone)' },
  },
  outputs: { done: {}, count: {} },
  run: async ({ from, to, block_id }, { done, count }) => {
    const { world } = getCurrentContext()
    const n = await world.fillBlocks(
      from as { x: number; y: number; z: number },
      to   as { x: number; y: number; z: number },
      String(block_id)
    )
    count.next(n)
    done.next(true)
  },
}

export const GetTopSolidBlock: CodeNode = {
  id: 'GetTopSolidBlock',
  displayName: 'GetTopSolidBlock',
  menuDisplayName: 'GetTopSolidBlock',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { position: {}, block_name: {} },
  run: async (_, { position, block_name }) => {
    const { world } = getCurrentContext()
    const result = await world.getTopSolidBlock()
    position.next(result.location)
    block_name.next(result.blockName)
  },
}

export const WorldQuery: CodeNode = {
  id: 'WorldQuery',
  displayName: 'WorldQuery',
  menuDisplayName: 'WorldQuery',
  icon: 'magnifying-glass',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    type: {
      description: 'Type to query',
      defaultValue: 'mob',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Entity', value: 'mob' },
          { label: 'Block',  value: 'block' },
          { label: 'Item',   value: 'item' },
        ],
      },
    },
  },
  outputs: { list: {} },
  run: async ({ type }, { list }) => {
    const { world } = getCurrentContext()
    list.next(await (world.queryData as any)(type))
  },
}

export const SendMessage: CodeNode = {
  id: 'SendMessage',
  displayName: 'SendMessage',
  menuDisplayName: 'SendMessage',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    message:  { description: 'Message to send' },
    target:   { description: 'Target selector or player name (default: @a)', defaultValue: '@a' },
  },
  outputs: { done: {} },
  run: async ({ message, target }, { done }) => {
    const { world } = getCurrentContext()
    await world.sendMessage(String(message), String(target))
    done.next(true)
  },
}

export const SetTimeOfDay: CodeNode = {
  id: 'SetTimeOfDay',
  displayName: 'SetTimeOfDay',
  menuDisplayName: 'SetTimeOfDay',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    time:    { description: 'Time of day (0–24000). Dawn=1000, Noon=6000, Sunset=12000, Night=13000', defaultValue: 6000 },
  },
  outputs: { done: {} },
  run: async ({ time }, { done }) => {
    const { world } = getCurrentContext()
    await world.setTimeOfDay(Number(time))
    done.next(true)
  },
}

export const SetWeather: CodeNode = {
  id: 'SetWeather',
  displayName: 'SetWeather',
  menuDisplayName: 'SetWeather',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    weather: {
      description: 'Weather type',
      defaultValue: 'Clear',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Clear',   value: 'Clear' },
          { label: 'Rain',    value: 'Rain' },
          { label: 'Thunder', value: 'Thunder' },
        ],
      },
    },
    duration: { description: 'Duration in ticks (20 ticks = 1 second)', defaultValue: 600 },
  },
  outputs: { done: {} },
  run: async ({ weather, duration }, { done }) => {
    const { world } = getCurrentContext()
    await world.setWeather(weather as any, Number(duration))
    done.next(true)
  },
}

export const SetBlock: CodeNode = {
  id: 'SetBlock',
  displayName: 'SetBlock',
  menuDisplayName: 'SetBlock',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    position: { description: 'Block position {x,y,z}' },
    block_id: { description: 'Block ID (e.g. minecraft:stone)' },
  },
  outputs: { done: {} },
  run: async ({ position, block_id }, { done }) => {
    const { world } = getCurrentContext()
    await world.setBlock(position as any, String(block_id))
    done.next(true)
  },
}

// --- server tier ---

export const BroadcastCommand: CodeNode = {
  id: 'BroadcastCommand',
  displayName: 'BroadcastCommand',
  menuDisplayName: 'BroadcastCommand',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    command:  { description: 'Minecraft command to broadcast to all worlds (without /)' },
  },
  outputs: { done: {} },
  run: async ({ command }, { done }) => {
    const world = getCurrentWorld()!
    await world.server.broadcastCommand(String(command))
    done.next(true)
  },
}

export const BroadcastMessage: CodeNode = {
  id: 'BroadcastMessage',
  displayName: 'BroadcastMessage',
  menuDisplayName: 'BroadcastMessage',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)' },
    message:  { description: 'Message to broadcast to all worlds' },
  },
  outputs: { done: {} },
  run: async ({ message }, { done }) => {
    const world = getCurrentWorld()!
    await world.server.broadcastMessage(String(message))
    done.next(true)
  },
}
