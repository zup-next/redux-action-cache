import createCache from './cache'
import getInvalidatedCaches from './invalidate-cache'
import createCacheForAction from './create-action-cache'
import forEach from 'lodash/find'

export const createCacheManager = (config: ConfigType): CacheManager => {
  const cache = createCache()
  if (config.storage) cache.load(config.storage.getItem)

  const checkInvalidations = (action: Action) => {
    const invalidatedCaches = getInvalidatedCaches(config.invalidations, action)
    forEach(invalidatedCaches, cache.removeCache)
    if (config.storage) cache.persist(config.storage.setItem)
  }

  const middleware = ({ getState }: Store) => (next: Next) => (action: Action) => {
    checkInvalidations(action)
    if (cache.isActionCached(action.type)) return getState()

    const actionCache = createCacheForAction(config, action.type)
    if (actionCache) cache.createCache(actionCache)
    if (config.storage) cache.persist(config.storage.setItem)

    return next(action)
  }

  return {
    getMiddleware: () => middleware,
    invalidateCacheFor: cache.removeCache,
  }
}
