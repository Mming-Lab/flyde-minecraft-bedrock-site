import { MinecraftBlockTypes, MinecraftItemTypes, MinecraftEntityTypes } from '@minecraft/vanilla-data'
import maps from './_maps/en_US.json'  // set-lang.js で書き換え

export type SelectOption = { value: string; label: string }

// ── ロケール設定（set-lang.js が import 行と同時に書き換える）─────────────

const locale = 'en_US'

// ── 全ID一覧の生成 ────────────────────────────────────────────────

function toOpts(enumObj: object, nameMap: Record<string, string>): SelectOption[] {
  return Object.values(enumObj)
    .map(id => {
      const label = nameMap[id as string]
      return { value: id as string, label: label ?? id, hasJa: label !== undefined }
    })
    .sort((a, b) => {
      if (a.hasJa && !b.hasJa) return -1
      if (!a.hasJa && b.hasJa) return 1
      return a.label.localeCompare(b.label, locale.split('_')[0])
    })
    .map(({ value, label }) => ({ value, label }))
}

export const BLOCK_ALL: SelectOption[] = toOpts(MinecraftBlockTypes, maps.BLOCK ?? {})
export const ITEM_ALL:  SelectOption[] = toOpts(MinecraftItemTypes,  maps.ITEM  ?? {})
export const MOB_ALL:   SelectOption[] = toOpts(MinecraftEntityTypes, maps.MOB  ?? {})

// 逆引きマップ（ID → ロケール名）
export const BLOCK_ID_TO: Record<string, string> = Object.fromEntries(BLOCK_ALL.map(o => [o.value, o.label]))
export const ITEM_ID_TO:  Record<string, string> = Object.fromEntries(ITEM_ALL.map(o  => [o.value, o.label]))
export const MOB_ID_TO:   Record<string, string> = Object.fromEntries(MOB_ALL.map(o   => [o.value, o.label]))

// ── ENUM ─────────────────────────────────────────────────────────

const ENUM: Record<string, Record<string, string>> = maps.ENUM ?? {}

export function enumOpts(kind: string): SelectOption[] {
  return Object.entries(ENUM[kind] ?? {}).map(([en, local]) => ({ label: String(local), value: en }))
}

/** イベント値（英語キー名）をロケール名に変換 */
export function getEnumLabel(kind: string, value: string): string | undefined {
  return (ENUM[kind] ?? {})[value]
}
