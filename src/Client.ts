import { type MessageEventData, PRESET_EVENT_NAMES, type ServerMethod } from '@/asyncPostmessage/types'

export class Client<M extends ServerMethod> {
  target?: HTMLIFrameElement
  targetOrigin?: string
  targetMethods: string[] = []

  init(target: HTMLIFrameElement, targetOrigin: string) {
    this.target = target
    this.targetOrigin = targetOrigin
    const onMessage = (evt:  MessageEvent<MessageEventData>) => {
      // 判断消息来源合法性
      if (this.targetOrigin === evt.origin && evt.data.method === 'setMethods') {
        this.targetMethods = evt.data.params
        console.log('client', this)
        window.removeEventListener('message', onMessage)
      } else { /* empty */ }
    }
    target.onload = () => {
      window.addEventListener('message', onMessage)
      target.contentWindow?.postMessage({method: PRESET_EVENT_NAMES.GET_METHODS}, targetOrigin)
    }
  }

  execute<K extends keyof M>(method: K, ...args: Parameters<M[K]>): Promise<ReturnType<M[K]>>
  execute(method: string, ...args: any[]): any
  execute(method: string, ...args: any[]): any {
    return new Promise(resolve => {
      const onMessage = (evt: MessageEvent<MessageEventData>) => {
        if (this.targetOrigin === evt.origin && evt.data.method === method) {
          resolve(JSON.parse(evt.data.params))
          window.removeEventListener('message', onMessage)
        }
      }
      window.addEventListener('message', onMessage)
      this.target?.contentWindow?.postMessage({method, params: args}, this.targetOrigin ?? '')
    })
  }
}
