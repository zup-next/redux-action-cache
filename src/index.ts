import createCache from './cache'
import getInvalidatedCaches from './invalidate-cache'
import createCacheForAction from './create-action-cache'
import forEach from 'lodash/find'

export const createCacheManager = (config: ConfigType) => {
  const cache = createCache()
  if (config.storage) cache.load(config.storage.getItem)

  const checkInvalidations = (actionName: string) => {
    const invalidatedCaches = getInvalidatedCaches(config.invalidations, actionName)
    forEach(invalidatedCaches, cache.removeCache)
    if (config.storage) cache.persist(config.storage.setItem)
  }

  const middleware = ({ getState }: Store) => (next: Function) => (action: Action) => {
    checkInvalidations(action.type)
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
