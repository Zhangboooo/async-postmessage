import { type MessageEventData, PRESET_EVENT_NAMES, type ServerMethod } from './types'

export class Server<M extends ServerMethod> {
  methods: M
  origins: string[]

  constructor(methods: M, origins: string[]) {
    this.methods = methods
    this.origins = origins

    this.init()
  }

  get methodNames() {
    return Object.keys(this.methods)
  }

  async onMessage(evt:  MessageEvent<MessageEventData>) {
    // 判断消息来源合法性
    if (this.origins.includes(evt.origin)) {
      // 判断是否初始化
      if (evt.data.method === PRESET_EVENT_NAMES.GET_METHODS) {
        // 返回方法列表
        evt.source?.postMessage({ method: PRESET_EVENT_NAMES.GET_METHODS, params: this.methodNames}, evt.origin)
      } else if (this.methodNames.includes(evt.data.method)) {
        // 执行方法
        const res = await this.methods[evt.data.method](...(evt.data.params ?? []))
        evt.source?.postMessage({ method: evt.data.method, params: JSON.stringify(res ?? {}) }, evt.origin)
      }
    } else { /* empty */ }
  }

  private init() {
    window.addEventListener('message', this.onMessage.bind(this))
  }
}
