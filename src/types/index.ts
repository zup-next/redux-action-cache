type InvalidationFunction = (action: Action) => Array<string>

export interface CacheRule {
  type?: 'pattern' | 'action'
  name: string | RegExp
  withProperties?: Array<string>
  validity?: number
  persist?: boolean
}

export interface InvalidationRule {
  type?: 'pattern' | 'action'
  invalidatedBy: string | RegExp
  invalidated: string[] | string
}

export type Invalidations = InvalidationRule[] | InvalidationFunction | undefined

export interface AsyncStorage {
  setItem: (key: string, value: string) => Promise<void>
  getItem: (key: string) => Promise<string | null>
}

export interface SimpleStorage {
  setItem: Storage['setItem']
  getItem: Storage['getItem']
}

export interface ConfigType {
  include: string[] | CacheRule[]
  exclude?: string[]
  invalidations?: Invalidations
  validity?: number
  persist?: boolean
  storage?: Storage | AsyncStorage | SimpleStorage
}

export interface Store {
  getState: Function
  dispatch: (action: Action) => void
}

export interface Action {
  type: string,
  [key: string]: any,
}

export interface CacheProperties {
  action: Action
  withProperties?: Array<string>
  validity?: number
  persist?: boolean
}

interface CacheObject {
  validity?: number
  persist?: boolean
  withProperties?: Array<string>
  cached: Record<string, number> // parameter values to last update
}

export interface CacheMap {
  [key: string]: CacheObject
}

export interface ValuesKey {
  [key: string]: string
}

export type Next = (action: Action) => void

export interface CacheManager {
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

export interface initialState {
  balance: ResourceState
  userData: UserData
  products: ResourceState
  order: Order
}

export interface MapReducer {
  [key: string]: (action: Action) => initialState
}
