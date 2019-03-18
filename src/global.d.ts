type InvalidationFunction = (action: Action) => Array<string>

interface CacheRule {
  type?: 'pattern' | 'action',
  name: string | RegExp,
  validity?: number,
  persist?: boolean,
}

interface InvalidationRule {
  type?: 'pattern' | 'action',
  invalidatedBy: string|RegExp,
  invalidated: Array<string>|string,
}

type Invalidations = Array<InvalidationRule> | InvalidationFunction | undefined

interface AsyncStorage {
  setItem: (key: string, value: string) => Promise<void>,
  getItem: (key: string) => Promise<string | null>,
}

interface ConfigType {
  include: Array<string|CacheRule>,
  exclude?: Array<string>,
  invalidations?: Invalidations,
  validity?: number,
  persist?: boolean,
  storage?: Storage | AsyncStorage,
}

interface Store {
  getState: Function,
}

interface Action {
  type: string,
}

interface CacheProperties {
  name: string,
  validity?: number,
  persist?: boolean,
}

interface CacheObject {
  lastUpdated: number,
  validity?: number,
  persist?: boolean,
}

interface CacheMap {
  [key: string]: CacheObject,
}
