import { type MaybeRef, unref, watch } from 'vue'
import { Client } from './Client'
import type { ServerMethod } from './types'
import { Server } from './Server'

export function createClient<M extends ServerMethod>(target: MaybeRef<HTMLIFrameElement>, targetOrigin:string){
  const client = new Client<M>()
  watch(target, val => {
    if (val instanceof HTMLIFrameElement) {
      client.init(unref(val), targetOrigin)
    }
  })
  return client
}

export function createServer<M extends ServerMethod>(methods: MaybeRef<M>, origins: MaybeRef<string[]>) {
  const server = new Server(unref(methods), unref(origins))
  watch(() => methods, (val) => {
    server.methods = unref(val)
  })
  watch(() => origins, (val) => {
    server.origins = unref(val)
  })
  return server
}

export {
  Client,
  Server
}
