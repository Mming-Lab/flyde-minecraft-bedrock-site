import type { CodeNode, InputPin, OutputPin } from '@flyde/core'

// ── 型定義 ────────────────────────────────────────────────────────

type InputI18n = {
  name: string
  description?: string
  /** editorType: 'select' の options label を英語value→ローカルラベルで上書き */
  options?: Record<string, string>
}

type OutputI18n = {
  name: string
  description?: string
}

export type NodeI18n = {
  displayName: string
  menuDisplayName: string
  description?: string
  inputs:  Record<string, InputI18n>
  outputs: Record<string, OutputI18n>
}

// ── ユーティリティ ────────────────────────────────────────────────

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// FlydeのevaluateConditionはconfigのキー（翻訳後のローカル名）をevalスコープに渡すため、
// conditionの識別子もローカル名に合わせる必要がある。
// シングルクォート内のselect値（例: 'block'）は対象外。
function rewriteCondition(cond: string, enToLocal: Record<string, string>): string {
  for (const [en, local] of Object.entries(enToLocal)) {
    cond = cond.replace(new RegExp(`(?<!')\\b${escapeRegex(en)}\\b(?!')`, 'g'), local)
  }
  return cond
}

function invertMap(map: Record<string, string>): Record<string, string> {
  const inv: Record<string, string> = {}
  for (const [k, v] of Object.entries(map)) inv[v] = k
  return inv
}

/** 英語ポート名 → ローカルポート名 */
function buildInEnToLocal(nodeI18n: NodeI18n): Record<string, string> {
  const m: Record<string, string> = {}
  for (const [enKey, entry] of Object.entries(nodeI18n.inputs)) m[enKey] = entry.name
  return m
}

function buildOutEnToLocal(nodeI18n: NodeI18n): Record<string, string> {
  const m: Record<string, string> = {}
  for (const [enKey, entry] of Object.entries(nodeI18n.outputs)) m[enKey] = entry.name
  return m
}

/** inputs の定義を翻訳する（ポート名・description・select labels） */
function localizeInputDefs(
  coreInputs: Record<string, any>,
  i18nInputs: Record<string, InputI18n>,
  enToLocal:  Record<string, string>,
): Record<string, InputPin> {
  const result: Record<string, InputPin> = {}
  for (const [enKey, pin] of Object.entries(coreInputs)) {
    const localKey = enToLocal[enKey] ?? enKey
    const i18n     = i18nInputs[enKey]
    if (!i18n) {
      result[localKey] = pin
      continue
    }
    const localPin: any = { ...pin }
    if (i18n.description !== undefined) localPin.description = i18n.description

    // select options のラベルをローカライズ
    if (i18n.options && pin.editorTypeData?.options) {
      localPin.editorTypeData = {
        ...pin.editorTypeData,
        options: pin.editorTypeData.options.map((opt: { value: string; label: string }) => ({
          value: opt.value,
          label: i18n.options![opt.value] ?? opt.label,
        })),
      }
    }

    if (pin.condition) {
      localPin.condition = rewriteCondition(pin.condition, enToLocal)
    }

    result[localKey] = localPin as InputPin
  }
  return result
}

/** outputs の定義を翻訳する */
function localizeOutputDefs(
  coreOutputs: Record<string, any>,
  i18nOutputs: Record<string, OutputI18n>,
  enToLocal:   Record<string, string>,
): Record<string, OutputPin> {
  const result: Record<string, OutputPin> = {}
  for (const [enKey, pin] of Object.entries(coreOutputs)) {
    const localKey = enToLocal[enKey] ?? enKey
    const i18n     = i18nOutputs[enKey]
    const localPin: OutputPin = { ...pin }
    if (i18n?.description !== undefined) localPin.description = i18n.description
    result[localKey] = localPin
  }
  return result
}

/** { localKey: value } を { enKey: value } にリマップ */
function remapInputs(
  localInputs: Record<string, unknown>,
  localToEn:  Record<string, string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [localKey, val] of Object.entries(localInputs)) {
    const enKey = localToEn[localKey] ?? localKey
    result[enKey] = val
  }
  return result
}

/** { localKey: Subject } を { enKey: Subject } にリマップ */
function remapOutputs(
  localOutputs: Record<string, { next: (v: unknown) => void }>,
  localToEn:   Record<string, string>,
): Record<string, { next: (v: unknown) => void }> {
  const result: Record<string, { next: (v: unknown) => void }> = {}
  for (const [localKey, subject] of Object.entries(localOutputs)) {
    const enKey = localToEn[localKey] ?? localKey
    result[enKey] = subject
  }
  return result
}

// ── メインエクスポート ────────────────────────────────────────────

/**
 * 英語ポート名の _core ノードに i18n 情報を合成して、
 * ローカルポート名を持つ CodeNode を返す。
 */
export function localizeNode(coreNode: CodeNode, nodeI18n: NodeI18n): CodeNode {
  const inEnToLocal  = buildInEnToLocal(nodeI18n)
  const outEnToLocal = buildOutEnToLocal(nodeI18n)
  const inLocalToEn  = invertMap(inEnToLocal)
  const outLocalToEn = invertMap(outEnToLocal)

  const localizedInputs  = localizeInputDefs( (coreNode.inputs ?? {}) as any,  nodeI18n.inputs,  inEnToLocal)
  const localizedOutputs = localizeOutputDefs((coreNode.outputs ?? {}) as any, nodeI18n.outputs, outEnToLocal)

  // i18n description のテンプレート解決
  // {{enPortName}} を含む場合、選択中の設定値（ローカル化されたラベル）で置換する関数にする
  let resolvedDescription: string | ((config: any) => string) | undefined
  if (nodeI18n.description !== undefined) {
    if (/{{.+?}}/.test(nodeI18n.description)) {
      const template = nodeI18n.description
      const capturedLocalInputs = localizedInputs
      resolvedDescription = (config: any) => {
        const enConfig: Record<string, any> = {}
        for (const [localKey, val] of Object.entries(config as Record<string, any>)) {
          enConfig[inLocalToEn[localKey] ?? localKey] = val
        }
        return template.replace(/{{(\w+)}}/g, (match, enKey) => {
          const val = enConfig[enKey]
          if (val && typeof val === 'object' && 'type' in val) {
            if (val.type === 'dynamic') return match
            // select の場合はローカル化されたラベルを優先して返す
            const localKey = inEnToLocal[enKey] ?? enKey
            const pin = (capturedLocalInputs as any)[localKey]
            const options: Array<{ value: string; label: string }> = pin?.editorTypeData?.options ?? []
            const opt = options.find(o => String(o.value) === String(val.value))
            return opt?.label ?? String(val.value ?? match)
          }
          return val != null ? String(val) : match
        })
      }
    } else {
      resolvedDescription = nodeI18n.description
    }
  }

  return {
    ...coreNode,
    displayName:     nodeI18n.displayName,
    menuDisplayName: nodeI18n.menuDisplayName,
    ...(resolvedDescription !== undefined ? { description: resolvedDescription } : {}),
    inputs:  localizedInputs,
    outputs: localizedOutputs,
    run: (localInputs: any, localOutputs: any, adv: any) => {
      const enInputs  = remapInputs( localInputs,  inLocalToEn)
      const enOutputs = remapOutputs(localOutputs, outLocalToEn)
      return coreNode.run(enInputs as any, enOutputs as any, adv)
    },
  }
}
