import { getDate, isExpired } from './utils/date'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { CacheMap, CacheProperties, AsyncStorage, Action } from './types'

export const cachePersistName = '@ReduxActionCache:cache'

const Cache = () => {
  let cache: CacheMap = {}

  const getUpdateKey = (action: Action, withProperties?: Array<string>) => {
    if (isEmpty(withProperties)) return 'default'
    const values = map(withProperties, (property: string) => action[property])

    return `(${values.join(',')})`
  }

  const isCacheValid = (lastUpdated: number, validity?: number) =>
    validity ? !isExpired(lastUpdated, validity) : true

  const isActionCached = (action: Action) => {
    const cacheInfo = cache[action.type]
    if (!cacheInfo) return false
    const key = getUpdateKey(action, cacheInfo.withProperties)
    const lastUpdated = cacheInfo.lastUpdatedMap[key]
    if (!lastUpdated) return false
    return isCacheValid(lastUpdated, cacheInfo.validity)
  }

  const createCache = ({ action, withProperties, validity, persist }: CacheProperties) => {
    const previousMap = cache[action.type] ? cache[action.type].lastUpdatedMap : {}
    const key = getUpdateKey(action, withProperties)
    cache[action.type] = {
      validity,
      persist,
      withProperties,
      lastUpdatedMap: { ...previousMap, [key]: getDate() },
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
