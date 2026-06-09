import { CodeNode } from '@flyde/core'
import { getCurrentContext } from '../context-manager'

const STYLE = { color: '#8F6D40' }

export const GetScoreboardObjectives: CodeNode = {
  id: 'GetScoreboardObjectives',
  displayName: 'GetScoreboardObjectives',
  menuDisplayName: 'GetScoreboardObjectives',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
  },
  outputs: { objectives: { description: 'Array of all scoreboard objectives' } },
  run: async (_, { objectives }) => {
    const { world } = getCurrentContext()
    objectives.next(await world.scoreboard.getObjectives())
  },
}

export const GetScoreboardObjective: CodeNode = {
  id: 'GetScoreboardObjective',
  displayName: 'GetScoreboardObjective',
  menuDisplayName: 'GetScoreboardObjective',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger:      { description: 'Trigger (optional)' },
    objective_id: { description: 'Scoreboard objective ID' },
  },
  outputs: { objective: { description: 'Scoreboard objective object' } },
  run: async ({ objective_id }, { objective }) => {
    const { world } = getCurrentContext()
    objective.next(await world.scoreboard.getObjective(String(objective_id)))
  },
}

export const AddScoreboardObjective: CodeNode = {
  id: 'AddScoreboardObjective',
  displayName: 'AddScoreboardObjective',
  menuDisplayName: 'AddScoreboardObjective',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger:      { description: 'Trigger (optional)' },
    objective_id: { description: 'Scoreboard objective ID' },
    display_name: { description: 'Display name (optional)' },
  },
  outputs: { objective: { description: 'The newly added objective' } },
  run: async ({ objective_id, display_name }, { objective }) => {
    const { world } = getCurrentContext()
    objective.next(await world.scoreboard.addObjective(
      String(objective_id),
      display_name != null ? String(display_name) : undefined
    ))
  },
}

export const RemoveScoreboardObjective: CodeNode = {
  id: 'RemoveScoreboardObjective',
  displayName: 'RemoveScoreboardObjective',
  menuDisplayName: 'RemoveScoreboardObjective',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger:      { description: 'Trigger (optional)' },
    objective_id: { description: 'Scoreboard objective ID' },
  },
  outputs: { result: { description: 'true if removed successfully' } },
  run: async ({ objective_id }, { result }) => {
    const { world } = getCurrentContext()
    result.next(await world.scoreboard.removeObjective(String(objective_id)))
  },
}

export const GetScores: CodeNode = {
  id: 'GetScores',
  displayName: 'GetScores',
  menuDisplayName: 'GetScores',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger:     { description: 'Trigger (optional)' },
    player_name: { description: 'Player name' },
  },
  outputs: { scores: { description: 'Array of {name, score} entries' } },
  run: async ({ player_name }, { scores }) => {
    const { world } = getCurrentContext()
    scores.next(await world.scoreboard.getScores(String(player_name)))
  },
}

export const GetScore: CodeNode = {
  id: 'GetScore',
  displayName: 'GetScore',
  menuDisplayName: 'GetScore',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger:      { description: 'Trigger (optional)' },
    player_name:  { description: 'Player name' },
    objective_id: { description: 'Scoreboard objective ID' },
  },
  outputs: { score: { description: 'Score value for the specified player' } },
  run: async ({ player_name, objective_id }, { score }) => {
    const { world } = getCurrentContext()
    score.next(await world.scoreboard.getScore(String(player_name), String(objective_id)))
  },
}

export const ScoreOperation: CodeNode = {
  id: 'ScoreOperation',
  displayName: 'ScoreOperation',
  menuDisplayName: 'ScoreOperation',
  icon: 'list-ol',
  defaultStyle: STYLE,
  inputs: {
    trigger: { description: 'Trigger (optional)' },
    operation: {
      description: 'Operation type',
      defaultValue: 'add',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Add',      value: 'add' },
          { label: 'Subtract', value: 'remove' },
          { label: 'Set',      value: 'set' },
        ],
      },
    },
    player_name:  { description: 'Player name' },
    objective_id: { description: 'Scoreboard objective ID' },
    value:        { description: 'Value to apply' },
  },
  outputs: { new_score: { description: 'Score value after the operation' } },
  run: async ({ operation, player_name, objective_id, value }, { new_score }) => {
    const { world } = getCurrentContext()
    const p = String(player_name)
    const id = String(objective_id)
    const v = Number(value)
    const k = String(operation)
    if      (k === 'add')    new_score.next(await world.scoreboard.addScore(p, id, v))
    else if (k === 'remove') new_score.next(await world.scoreboard.removeScore(p, id, v))
    else if (k === 'set')    new_score.next(await world.scoreboard.setScore(p, id, v))
  },
}
