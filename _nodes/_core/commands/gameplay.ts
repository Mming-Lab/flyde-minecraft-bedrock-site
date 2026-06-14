import { CodeNode } from '@flyde/core'
import { getCurrentContext } from '../../context-manager'

const STYLE = { color: '#8F6D40' }

export const RunCommand: CodeNode = {
  id: 'RunCommand',
  displayName: 'RunCommand',
  menuDisplayName: 'RunCommand',
  icon: 'play',
  defaultStyle: STYLE,
  inputs: {
    trigger:  { description: 'Trigger (optional)', defaultValue: true },
    command:  { description: 'Minecraft command to run (without /)' },
  },
  outputs: {
    done: { description: 'Emits true when command completes' },
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
  outputs: { value: { description: 'Current game time in ticks' } },
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
    is_day: { description: 'true if daytime, false if night' },
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
  outputs: { weather: { description: 'Current weather name (Clear / Rain / Thunder)' } },
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
  outputs: { done: { description: 'Emits true when fill completes' }, count: { description: 'Number of blocks filled' } },
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
  outputs: { position: { description: 'Position {x,y,z} of the top solid block' }, block_name: { description: 'Minecraft ID of the top solid block' } },
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
  outputs: { list: { description: 'Array of matching entity / block / item data' } },
  run: async ({ type }, { list }) => {
    const { world } = getCurrentContext()
    list.next(await (world.queryData as any)(type))
  },
}

