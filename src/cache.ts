import { getDate, isExpired } from './utils/date'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import { CacheMap, CacheProperties, AsyncStorage, Action } from './types'

export const cachePersistName = '@ReduxActionCache:cache'

const Cache = () => {
  let cache: CacheMap = {}

  const isCacheValid = (name: string) => {
    const lastUpdated = cache[name].lastUpdated
    const validity = cache[name].validity

    return validity ? !isExpired(lastUpdated, validity) : true
  }

  const isActionCached = (name: string) => {
    if (!cache[name]) return false

    return isCacheValid(name)
  }

  const getInstances = (action: Action, withParams: Array<string>) => {
    const key = map(withParams, propertyName => action[propertyName]).join(',')
    const value = getDate()

    return cache[action.type]
      ? { ...cache[action.type].instances, [key]: value }
      : { [key]: value }
  }

  const createCache = ({ action, withParams, validity, persist }: CacheProperties) => {
    cache[action.type] = {
      lastUpdated: getDate(),
      validity,
      persist,
      instances: withParams ? getInstances(action, withParams) : undefined,
    }
  }

  const getCacheByAction = (name: string) => ({ ...cache[name] })

  const removeCache = (action: string | string[]): void => {
    Array.isArray(action) ? action.forEach(name => delete cache[name]) : delete cache[action]
  }

  const persist = (setItem: Storage['setItem']) => {
    const cacheToPersist = reduce(cache, (result, value, key) => {
      if (value.persist) return { ...result, [key]: value }
      return result
    }, {})

    setItem(cachePersistName, JSON.stringify(cacheToPersist))
  }

  const updateCacheWithJson = (json: string | null) => {
    if (json) cache = { ...JSON.parse(json), ...cache }
  }

  const load = (getItem: Storage['getItem'] | AsyncStorage['getItem']) => {
    const persistedCache = getItem(cachePersistName)

    if (persistedCache instanceof Promise) persistedCache.then(updateCacheWithJson)
    else updateCacheWithJson(persistedCache)
  }

  return {
    isActionCached,
    createCache,
    getCacheByAction,
    removeCache,
    persist,
    load,
  }
}

export default Cache
