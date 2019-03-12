import { getDate, isExpired } from './utils/date'
import reduce from 'lodash/reduce'

const cachePersistName = '@ReduxActionCache:cache'

const promisify = (result: any) => result && result.then ? result : Promise.resolve(result)

const Cache = () => {
  let cache: CacheMap = {}

  const isCacheValid = (name: string) => {
    const lastUpdated = cache[name].lastUpdated
    const validity = cache[name].validity

    return validity === undefined ? true : !isExpired(lastUpdated, validity)
  }

  const isActionCached = (name: string) => {
    if (!cache[name]) return false

    return isCacheValid(name)
  }

  const createCache = ({ name, validity, persist }: CacheProperties) => {
    cache[name] = {
      lastUpdated: getDate(),
      validity,
      persist,
    }
  }

  const getCacheObject = () => cache

  const removeCache = (name: string) => delete cache[name]

  const persist = (setItem: Storage['setItem']) => {
    const cacheToPersist = reduce(cache, (result, value, key) => {
      if (value.persist) return { ...result, [key]: value }
      return result
    }, {})

    setItem(cachePersistName, JSON.stringify(cacheToPersist))
  }

  const load = async (getItem: Storage['getItem']) => {
    const data = await promisify(getItem(cachePersistName))
    cache = data && JSON.parse(data)
  }

  return {
    isActionCached,
    createCache,
    getCacheObject,
    removeCache,
    persist,
    load,
  }
}

export default Cache
