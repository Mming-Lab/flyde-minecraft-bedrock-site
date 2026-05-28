export type Result<T = unknown> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: string }

export function Ok<T>(value: T): { readonly ok: true; readonly value: T } {
  return { ok: true, value }
}

export function Err(error: string): { readonly ok: false; readonly error: string } {
  return { ok: false, error }
}

// 鉄道指向プログラミング用の統一コンテキスト型
// フロー内でワールドとプレイヤーを1つの値として持ち回す
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type McContext = { world: any; player: any }

// micro:bit シリアル通信ハンドル
export interface MicroBitHandle {
  port: {
    write(data: string, callback: (err?: Error | null) => void): void
  }
  parser: {
    on(event: 'data', handler: (data: string) => void): void
  }
}
