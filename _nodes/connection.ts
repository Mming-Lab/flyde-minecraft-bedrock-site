import { CodeNode } from '@flyde/core'
import { ServerEvent } from 'socket-be'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { getServer } from './socketbe-instance'
import type { MicroBitHandle } from './types/common'

const STYLE = { color: '#5C5C5C' } // connection

// Flyde の内部テレメトリ(reportEvent)が fetch を投げっぱなしにする。
// Node.js v16+ は unhandledRejection でプロセスをクラッシュさせるため、
// ここで握り潰してプロセスを生かし続ける。
process.on('unhandledRejection', () => {})

// Flyde は mode:'optional' 入力があると run() を繰り返し呼ぶため、
// モジュールレベルのフラグと pending Promise でループを止める。
let _mcConnectRunning = false

export const Minecraft接続: CodeNode = {
  id: 'MinecraftConnect',
  displayName: 'Minecraft接続',
  menuDisplayName: 'Minecraft接続',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    ポート: { description: 'WebSocketポート番号（デフォルト: 8080）', mode: 'optional' },
  },
  outputs: {
    ワールド: {},
    エラー: {},
  },
  run: ({ ポート }, { ワールド, エラー }, adv) => {
    if (_mcConnectRunning) {
      return new Promise<void>(() => {})
    }
    _mcConnectRunning = true
    return new Promise<void>((resolve) => {
      try {
        const server = getServer(ポート ?? 8080, (msg) => エラー.next(msg))
        const handler = (signal: any) => ワールド.next(signal.world)
        server.on(ServerEvent.WorldAdd, handler)
        adv.onCleanup(() => {
          server.remove(ServerEvent.WorldAdd, handler)
          _mcConnectRunning = false
          resolve()
        })
      } catch (e) {
        エラー.next(String(e))
        _mcConnectRunning = false
        resolve()
      }
    })
  },
}

export const MicroBit接続: CodeNode = {
  id: 'MicroBitConnect',
  displayName: 'micro:bit接続',
  menuDisplayName: 'micro:bit接続',
  defaultStyle: STYLE,
  inputs: {
    COMポート: { description: 'COMポート（例: COM3）' },
    ボーレート: { description: 'ボーレート（デフォルト: 115200）' },
  },
  outputs: {
    接続完了: {},
    エラー: {},
  },
  run: ({ COMポート, ボーレート }, { 接続完了, エラー }) => {
    try {
      const port = new SerialPort({ path: COMポート, baudRate: ボーレート ?? 115200 })
      const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
      const handle: MicroBitHandle = { port, parser }
      port.on('open', () => 接続完了.next(handle))
      port.on('error', (err: Error) => エラー.next(err.message))
    } catch (e) {
      エラー.next(String(e))
    }
  },
}
