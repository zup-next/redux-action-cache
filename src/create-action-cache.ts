import includes from 'lodash/includes'
import forEach from 'lodash/forEach'
import merge from 'lodash/merge'
import map from 'lodash/map'
import { CacheRule, ConfigType, Action } from './types'

const getCacheRule = (cacheRules: Array<string | CacheRule>, actionName: string) => {
  let result: CacheRule | undefined

  forEach(cacheRules, (rule) => {
    const cacheRule = typeof rule === 'string' ? { type: 'action', name: rule } : rule
    const matchesPattern = cacheRule.type === 'pattern' && actionName.match(cacheRule.name)
    const matches = matchesPattern || actionName === cacheRule.name

    if (matches) result = merge(result, cacheRule)
  })

  return result
}

const getParams = (action: Action, propertyNames?: Array<string>) =>
  map(propertyNames, property => action[property])

export default (config: ConfigType, action: Action) => {
  const isExcluded = includes(config.exclude, action.type)
  if (isExcluded) return

  const cacheRule = getCacheRule(config.include, action.type)

  if (cacheRule) {
    return {
      action,
      withParams: cacheRule.withParams,
      validity: cacheRule.validity !== undefined ? cacheRule.validity : config.validity,
      persist: cacheRule.persist !== undefined ? cacheRule.persist : config.persist,
    }
  }
}
