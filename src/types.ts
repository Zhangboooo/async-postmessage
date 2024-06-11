export interface ServerMethod {
  [key: string]: (...args: any[]) => any
}

export interface MessageEventData {
  method: string
  params: any
}

export enum PRESET_EVENT_NAMES {
  GET_METHODS = 'GET_METHODS'
}
