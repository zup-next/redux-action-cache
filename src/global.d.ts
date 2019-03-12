type InvalidationFunction = (actionName: string) => Array<string>

type CacheRule = {
  type?: 'pattern' | 'action',
  name: string | RegExp,
  validity?: number,
  persist?: boolean,
}

type InvalidationRule = {
  type?: 'pattern' | 'action',
  invalidatedBy: string|RegExp,
  invalidated: Array<string>|string,
}

type Invalidations = Array<InvalidationRule> | InvalidationFunction | undefined

type ConfigType = {
  include: Array<string|CacheRule>,
  exclude?: Array<String>,
  invalidations: Invalidations,
  validity?: number,
  persist?: boolean,
  storage?: Storage,
}

type Store = {
  getState: Function,
}

type Action = {
  type: string,
}

type CacheProperties = {
  name: string,
  validity?: number,
  persist?: boolean,
}

type CacheObject = {
  lastUpdated: number,
  validity?: number,
  persist?: boolean,
}

type CacheMap = {
  [key:string]: CacheObject,
}
