import { appendFileSync } from 'fs'
import { join } from 'path'
import { CodeNode } from '@flyde/core'
import { ServerEvent } from 'socket-be'
import { getServer, stopServer } from '../ws-server'

const DIAG_FILE = join(process.cwd(), 'mc-flow-diag.log')
function diagLog(msg: string): void {
  try { appendFileSync(DIAG_FILE, `[${new Date().toISOString()}] ${msg}\n`) } catch {}
}
function log(msg: string): void { diagLog(`[connection] ${msg}`) }

const STYLE = { color: '#5C5C5C' }

process.on('unhandledRejection', (reason: unknown) => {
  if (String(reason).includes('fetch')) return
  console.error('\n[Error]', reason, '\n')
})

let _mcConnectRunning = false

export const MinecraftConnect: CodeNode = {
  id: 'MinecraftConnect',
  displayName: 'MinecraftConnect',
  menuDisplayName: 'MinecraftConnect',
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
        const server = getServer(p, (msg) => { diagLog(`[mc-flow] onError callback: ${msg}`); error.next(msg) })
        diagLog(`[mc-flow] getServer returned, registering WorldAdd handler`)
        log(`Enter in Minecraft: /connect localhost:${p}`)
        const handler = (signal: any) => {
          diagLog(`[mc-flow] WorldAdd fired! world type=${typeof signal?.world}, signal keys=${Object.keys(signal ?? {}).join(',')}`)
          world.next(true)
        }
        server.on(ServerEvent.WorldAdd, handler)
        diagLog(`[mc-flow] WorldAdd handler registered`)

        const removeHandler = (signal: any) => {
          diagLog(`[mc-flow] WorldRemove fired! code=${signal?.code}`)
        }
        server.on(ServerEvent.WorldRemove, removeHandler)

        adv.onCleanup(async () => {
          diagLog(`[mc-flow] onCleanup called`)
          server.remove(ServerEvent.WorldAdd, handler)
          server.remove(ServerEvent.WorldRemove, removeHandler)
          await stopServer()
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
