import { CodeNode } from '@flyde/core'
import { ServerEvent } from 'socket-be'
import { getServer, stopServer } from '../ws-server'
import { clearCurrentContext } from '../context-manager'
import { diagLog } from '../diag'

const log = (msg: string) => diagLog('INFO',  'connection', msg)
const dbg = (msg: string) => diagLog('DEBUG', 'flyde-mc',    msg)

const STYLE = { color: '#5C5C5C' }

if (!(process as any).__fmcRejectionHandlerRegistered) {
  ;(process as any).__fmcRejectionHandlerRegistered = true
  process.on('unhandledRejection', (reason: unknown) => {
    if (String(reason).includes('fetch')) return
    console.error('\n[Error]', reason, '\n')
  })
}

let _mcConnectRunning = false

export const MinecraftConnect: CodeNode = {
  id: 'MinecraftConnect',
  displayName: 'MinecraftConnect',
  menuDisplayName: 'MinecraftConnect',
  description: 'Minecraftとの WebSocket 接続を確立する',
  icon: 'plug',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    port: { description: 'WebSocket port number (default: 8080)', mode: 'optional' },
  },
  outputs: {
    world: {},
    error: {},
  },
  run: ({ port }, { world, error }, adv) => {
    if (_mcConnectRunning) {
      return new Promise<void>(() => {})
    }
    _mcConnectRunning = true
    return new Promise<void>((resolve) => {
      try {
        const p = port ?? 8080
        const server = getServer(p, (msg) => { diagLog('WARN', 'flyde-mc', `onError callback: ${msg}`); error.next(msg) })
        dbg(`getServer returned, registering WorldAdd handler`)
        log(`Enter in Minecraft: /connect localhost:${p}`)
        const handler = (signal: any) => {
          dbg(`WorldAdd fired! world type=${typeof signal?.world}, signal keys=${Object.keys(signal ?? {}).join(',')}`)
          world.next(true)
        }
        server.on(ServerEvent.WorldAdd, handler)
        dbg(`WorldAdd handler registered`)

        const removeHandler = (signal: any) => {
          dbg(`WorldRemove fired! code=${signal?.code}`)
        }
        server.on(ServerEvent.WorldRemove, removeHandler)

        adv.onCleanup(async () => {
          dbg(`onCleanup called`)
          server.remove(ServerEvent.WorldAdd, handler)
          server.remove(ServerEvent.WorldRemove, removeHandler)
          await stopServer()
          clearCurrentContext()
          _mcConnectRunning = false
          resolve()
        })
      } catch (e) {
        error.next(String(e))
        _mcConnectRunning = false
        resolve()
      }
    })
  },
}

export const MinecraftDisconnect: CodeNode = {
  id: 'MinecraftDisconnect',
  displayName: 'MinecraftDisconnect',
  menuDisplayName: 'MinecraftDisconnect',
  description: 'WebSocket サーバーを停止して接続を切断する',
  icon: 'plug',
  defaultStyle: STYLE,
  completionOutputs: [],
  inputs: {
    trigger: { description: 'Trigger to disconnect' },
  },
  outputs: {},
  run: async () => {
    await stopServer()
    process.exit(0)
  },
}
