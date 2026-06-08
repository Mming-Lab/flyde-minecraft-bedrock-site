import { CodeNode } from '@flyde/core'

const STYLE = { color: '#107C10' }

type Vec3 = { x: number; y: number; z: number }
type AABB = { min: Vec3; max: Vec3 }

export const Vector3Op: CodeNode = {
  id: 'Vector3Op',
  displayName: 'Vector3Op',
  menuDisplayName: 'Vector3Op',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    op: {
      description: 'Operation type',
      defaultValue: 'add',
      editorType: 'select',
      editorTypeData: {
        options: [
          { label: 'Assemble', value: 'assemble' },
          { label: 'Add',      value: 'add' },
          { label: 'Subtract', value: 'subtract' },
          { label: 'Scale',    value: 'scale' },
          { label: 'Floor',    value: 'floor' },
          { label: 'Ceil',     value: 'ceil' },
          { label: 'Fill Y',   value: 'fill_y' },
        ],
      },
    },
    x:      { description: 'X coordinate', condition: "op === 'assemble'", defaultValue: 0 },
    y:      { description: 'Y coordinate', condition: "op === 'assemble'", defaultValue: 0 },
    z:      { description: 'Z coordinate', condition: "op === 'assemble'", defaultValue: 0 },
    pos_a:  { description: 'Base position {x,y,z}', condition: "op === 'add' || op === 'subtract'" },
    pos_b:  { description: 'Other position {x,y,z}', condition: "op === 'add' || op === 'subtract'" },
    position: { description: 'Position {x,y,z}', condition: "op === 'scale' || op === 'floor' || op === 'ceil'" },
    scale:  { description: 'Scalar multiplier (e.g. 2 for 2x)', condition: "op === 'scale'", defaultValue: 1 },
    pos_xz: { description: '2D position {x,z}', condition: "op === 'fill_y'" },
    Y:      { description: 'Y value', condition: "op === 'fill_y'", defaultValue: 64 },
  },
  outputs: {
    result: { description: 'Resulting position {x,y,z}' },
  },
  run: (inputs, { result }) => {
    const op = String(inputs['op'])
    if (op === 'assemble') {
      result.next({ x: Number(inputs['x'] ?? 0), y: Number(inputs['y'] ?? 0), z: Number(inputs['z'] ?? 0) })
    } else if (op === 'add') {
      const a = inputs['pos_a'] as Vec3, b = inputs['pos_b'] as Vec3
      result.next({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })
    } else if (op === 'subtract') {
      const a = inputs['pos_a'] as Vec3, b = inputs['pos_b'] as Vec3
      result.next({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z })
    } else if (op === 'scale') {
      const v = inputs['position'] as Vec3, s = Number(inputs['scale'])
      result.next({ x: v.x * s, y: v.y * s, z: v.z * s })
    } else if (op === 'floor') {
      const v = inputs['position'] as Vec3
      result.next({ x: Math.floor(v.x), y: Math.floor(v.y), z: Math.floor(v.z) })
    } else if (op === 'ceil') {
      const v = inputs['position'] as Vec3
      result.next({ x: Math.ceil(v.x), y: Math.ceil(v.y), z: Math.ceil(v.z) })
    } else if (op === 'fill_y') {
      const v = inputs['pos_xz'] as { x: number; z: number }
      result.next({ x: v.x, y: Number(inputs['Y'] ?? 64), z: v.z })
    }
  },
}

export const Vector3Distance: CodeNode = {
  id: 'Vector3Distance',
  displayName: 'Vector3Distance',
  menuDisplayName: 'Vector3Distance',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    pos_a: { description: 'Start position {x,y,z}' },
    pos_b: { description: 'End position {x,y,z}' },
  },
  outputs: {
    distance: {},
  },
  run: ({ pos_a, pos_b }, { distance }) => {
    const a = pos_a as Vec3, b = pos_b as Vec3
    const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
    distance.next(Math.sqrt(dx * dx + dy * dy + dz * dz))
  },
}

export const Vector3ToString: CodeNode = {
  id: 'Vector3ToString',
  displayName: 'Vector3ToString',
  menuDisplayName: 'Vector3ToString',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    position: { description: 'Position to convert {x,y,z}' },
  },
  outputs: {
    text: {},
  },
  run: ({ position }, { text }) => {
    const v = position as Vec3
    text.next(`${v.x} ${v.y} ${v.z}`)
  },
}

export const Vector3Split: CodeNode = {
  id: 'Vector3Split',
  displayName: 'Vector3Split',
  menuDisplayName: 'Vector3Split',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    position: { description: 'Position to split {x,y,z}' },
  },
  outputs: {
    x: {},
    y: {},
    z: {},
  },
  run: ({ position }, { x, y, z }) => {
    const v = position as Vec3
    x.next(v.x)
    y.next(v.y)
    z.next(v.z)
  },
}

export const ClampNumber: CodeNode = {
  id: 'ClampNumber',
  displayName: 'ClampNumber',
  menuDisplayName: 'ClampNumber',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    value: { description: 'Number to clamp' },
    min:   { description: 'Lower bound' },
    max:   { description: 'Upper bound' },
  },
  outputs: {
    result: {},
  },
  run: ({ value, min, max }, { result }) => {
    result.next(Math.min(Math.max(Number(value), Number(min)), Number(max)))
  },
}

export const AABBCreate: CodeNode = {
  id: 'AABBCreate',
  displayName: 'AABBCreate',
  menuDisplayName: 'AABBCreate',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    corner_a: { description: 'Corner 1 {x,y,z} (order does not matter)' },
    corner_b: { description: 'Corner 2 {x,y,z} (order does not matter)' },
  },
  outputs: { area: {} },
  run: ({ corner_a, corner_b }, { area }) => {
    const a = corner_a as Vec3, b = corner_b as Vec3
    area.next({
      min: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), z: Math.min(a.z, b.z) },
      max: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y), z: Math.max(a.z, b.z) },
    })
  },
}

export const AABBIsInside: CodeNode = {
  id: 'AABBIsInside',
  displayName: 'AABBIsInside',
  menuDisplayName: 'AABBIsInside',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    area:     { description: 'AABB area {min, max}' },
    position: { description: 'Position to test {x,y,z}' },
  },
  outputs: { result: {} },
  run: ({ area, position }, { result }) => {
    const box = area as AABB, p = position as Vec3
    result.next(
      p.x >= box.min.x && p.x <= box.max.x &&
      p.y >= box.min.y && p.y <= box.max.y &&
      p.z >= box.min.z && p.z <= box.max.z
    )
  },
}

// --- server tier ---

export const Vector3Lerp: CodeNode = {
  id: 'Vector3Lerp',
  displayName: 'Vector3Lerp',
  menuDisplayName: 'Vector3Lerp',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    pos_a: { description: 'Start position {x,y,z}' },
    pos_b: { description: 'End position {x,y,z}' },
    t:     { description: 'Interpolation factor (0.0–1.0)', defaultValue: 0.5 },
  },
  outputs: {
    result: {},
  },
  run: ({ pos_a, pos_b, t }, { result }) => {
    const a = pos_a as Vec3, b = pos_b as Vec3, f = Number(t)
    result.next({
      x: a.x + (b.x - a.x) * f,
      y: a.y + (b.y - a.y) * f,
      z: a.z + (b.z - a.z) * f,
    })
  },
}

export const Vector3Normalize: CodeNode = {
  id: 'Vector3Normalize',
  displayName: 'Vector3Normalize',
  menuDisplayName: 'Vec3Normalize',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    position: { description: 'Vector to normalize {x,y,z}' },
  },
  outputs: {
    result: {},
  },
  run: ({ position }, { result }) => {
    const v = position as Vec3
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z)
    result.next(len === 0 ? { x: 0, y: 0, z: 0 } : { x: v.x / len, y: v.y / len, z: v.z / len })
  },
}

export const Vector3Dot: CodeNode = {
  id: 'Vector3Dot',
  displayName: 'Vector3Dot',
  menuDisplayName: 'Vector3Dot',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    pos_a: { description: 'Vector A {x,y,z}' },
    pos_b: { description: 'Vector B {x,y,z}' },
  },
  outputs: {
    value: {},
  },
  run: ({ pos_a, pos_b }, { value }) => {
    const a = pos_a as Vec3, b = pos_b as Vec3
    value.next(a.x * b.x + a.y * b.y + a.z * b.z)
  },
}

export const AABBTranslate: CodeNode = {
  id: 'AABBTranslate',
  displayName: 'AABBTranslate',
  menuDisplayName: 'AABBTranslate',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    area:  { description: 'AABB area {min, max}' },
    delta: { description: 'Translation vector {x,y,z}' },
  },
  outputs: {
    area: {},
  },
  run: ({ area, delta }, outputs) => {
    const box = area as AABB, d = delta as Vec3
    outputs.area.next({
      min: { x: box.min.x + d.x, y: box.min.y + d.y, z: box.min.z + d.z },
      max: { x: box.max.x + d.x, y: box.max.y + d.y, z: box.max.z + d.z },
    })
  },
}

export const AABBIntersects: CodeNode = {
  id: 'AABBIntersects',
  displayName: 'AABBIntersects',
  menuDisplayName: 'AABBIntersects',
  icon: 'calculator',
  defaultStyle: STYLE,
  inputs: {
    area_a: { description: 'AABB area A {min, max}' },
    area_b: { description: 'AABB area B {min, max}' },
  },
  outputs: {
    result: {},
  },
  run: ({ area_a, area_b }, { result }) => {
    const a = area_a as AABB, b = area_b as AABB
    result.next(
      a.min.x <= b.max.x && a.max.x >= b.min.x &&
      a.min.y <= b.max.y && a.max.y >= b.min.y &&
      a.min.z <= b.max.z && a.max.z >= b.min.z
    )
  },
}
