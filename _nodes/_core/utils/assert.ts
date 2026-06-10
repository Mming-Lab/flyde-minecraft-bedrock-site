import { CodeNode } from '@flyde/core'
import { diagLog } from '../../diag'

const STYLE = { color: '#767676' }

export const Assert: CodeNode = {
  id: 'Assert',
  displayName: 'Assert',
  menuDisplayName: 'Assert',
  description: 'Compare actual vs expected and log PASS/FAIL to the log file.',
  icon: 'list-check',
  defaultStyle: STYLE,
  inputs: {
    actual:    { description: 'Actual value to test' },
    expected:  { description: 'Expected value' },
    op: {
      description: 'Comparison operator',
      defaultValue: 'eq',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Equal (===)',          value: 'eq'     },
          { label: 'Deep equal (JSON)',    value: 'deep'   },
          { label: 'Less than (<)',        value: 'lt'     },
          { label: 'Greater than (>)',     value: 'gt'     },
          { label: 'Less or equal (≤)',   value: 'lte'    },
          { label: 'Greater or equal (≥)', value: 'gte'   },
          { label: 'Approx (±tolerance)', value: 'approx' },
        ],
      },
    },
    testId:    { description: 'Test case ID (e.g. TC-111)', defaultValue: '?' },
    tolerance: { description: 'Tolerance for approx comparison', defaultValue: 0.001 },
  },
  outputs: {
    done:   { description: 'Always emits true (for chaining to next test)' },
    passed: { description: 'Emits true when test passes' },
    failed: { description: 'Emits actual value when test fails' },
  },
  run: ({ actual, expected, op, testId, tolerance }, { done, passed, failed }) => {
    const id    = testId != null ? String(testId) : '?'
    const opStr = String(op ?? 'eq')
    const tol   = Number(tolerance ?? 0.001)

    let ok = false
    if      (opStr === 'eq')     ok = actual === expected
    else if (opStr === 'deep')   ok = JSON.stringify(actual) === JSON.stringify(expected)
    else if (opStr === 'lt')     ok = Number(actual) <  Number(expected)
    else if (opStr === 'gt')     ok = Number(actual) >  Number(expected)
    else if (opStr === 'lte')    ok = Number(actual) <= Number(expected)
    else if (opStr === 'gte')    ok = Number(actual) >= Number(expected)
    else if (opStr === 'approx') ok = Math.abs(Number(actual) - Number(expected)) <= tol

    if (ok) {
      diagLog('INFO', `[${id}]`, 'PASS')
      passed.next(true)
    } else {
      diagLog('WARN', `[${id}]`, `FAIL  actual=${JSON.stringify(actual)}  expected=${JSON.stringify(expected)}  op=${opStr}`)
      failed.next(actual)
    }
    done.next(true)
  },
}
