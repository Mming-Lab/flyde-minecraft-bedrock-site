import { CodeNode } from '@flyde/core'
import { ServerEvent } from 'socket-be'
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { getServer } from './socketbe-instance'
import type { MicroBitHandle } from './types/common'

const STYLE = { color: '#5C5C5C' } // connection

export const Minecraft接続: CodeNode = {
  id: 'MinecraftConnect',
  displayName: 'Minecraft接続',
  defaultStyle: STYLE,
  inputs: {
    ポート: { description: 'WebSocketポート番号（デフォルト: 8080）', mode: 'optional' },
  },
  outputs: {
    ワールド: {},
    エラー: {},
  },
  run: ({ ポート }, { ワールド, エラー }) => {
    try {
      const server = getServer(ポート ?? 8080)
      server.on(ServerEvent.WorldAdd, (signal) => {
        ワールド.next(signal.world)
      })
    } catch (e) {
      エラー.next(String(e))
    }
  },
}

export const MicroBit接続: CodeNode = {
  id: 'MicroBitConnect',
  displayName: 'micro:bit接続',
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
