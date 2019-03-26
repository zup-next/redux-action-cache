type InvalidationFunction = (action: Action) => Array<string>

interface CacheRule {
  type?: 'pattern' | 'action'
  name: string | RegExp
  validity?: number
  persist?: boolean
}

interface InvalidationRule {
  type?: 'pattern' | 'action'
  invalidatedBy: string | RegExp
  invalidated: string[] | string
}

type Invalidations = InvalidationRule[] | InvalidationFunction | undefined

interface AsyncStorage {
  setItem: (key: string, value: string) => Promise<void>
  getItem: (key: string) => Promise<string | null>
}

interface SimpleStorage {
  setItem: Storage['setItem']
  getItem: Storage['getItem']
}

interface ConfigType {
  include: string[] | CacheRule[]
  exclude?: string[]
  invalidations?: Invalidations
  validity?: number
  persist?: boolean
  storage?: Storage | AsyncStorage | SimpleStorage
}

interface Store {
  getState: Function
  dispatch: (action: Action) => void
}

interface Action {
  type: string
}

interface CacheProperties {
  name: string
  validity?: number
  persist?: boolean
}

interface CacheObject {
  lastUpdated: number
  validity?: number
  persist?: boolean
}

interface CacheMap {
  [key: string]: CacheObject
}

interface ValuesKey {
  [key: string]: string
}

type Next = (action: Action) => void

interface CacheManager {
  getMiddleware: () => ({ getState }: Store) => (next: Next) => (action: Action) => any
  invalidateCacheFor: (action: string | string[]) => void
}

type status = 'NOT_LOADED' | 'LOADING' | 'ERROR' | 'SUCCESS'

interface ResourceState {
  status: status
  data: null | any
}

interface UserData extends ResourceState {
  saveStatus: status
}

interface Order {
  createStatus: status
  status: status
}

interface initialState {
  balance: ResourceState
  userData: UserData
  products: ResourceState
  order: Order
}

interface MapReducer {
  [key: string]: (action: Action) => initialState
}
