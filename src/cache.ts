import { getDate, isExpired, addSeconds } from './utils/date'
import reduce from 'lodash/reduce'

const cachePersistName = '@ReduxActionCache:cache'

const promisify = (result: any) => result.then ? result : Promise.resolve(result)

const Cache = () => {
  let cache: CacheMap = {}

  const isCacheValid = (name: string) => {
    const lastUpdated = cache[name].lastUpdated
    const validity = cache[name].validity
    const expireDate = addSeconds(lastUpdated, validity).toISOString()

    return !isExpired(expireDate)
  }

  const isActionCached = (name: string) => {
    if (!cache[name]) return false

    return isCacheValid(name)
  }

  const createCache = ({ name, validity, persist }: CacheProperties) => {
    cache[name] = {
      lastUpdated: getDate(''),
      validity,
      persist,
    }
  }

  const removeCache = (name: string) => delete cache[name]

  const persist = (setItem: SetItemProperties) => {
    const cacheable = reduce(cache, (result, value, key) => {
      if (value.persist) return { ...result, [key]: value }
      return result
    }, {})

    setItem(cachePersistName, JSON.stringify(cacheable))
  }

  const load = async (getItem: GetItemProperties) => {
    const data = await promisify(getItem(cachePersistName))
    cache = JSON.parse(data)
  }

  return {
    isActionCached,
    createCache,
    removeCache,
    persist,
    load,
  }
}

export default Cache