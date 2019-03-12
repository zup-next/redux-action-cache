import includes from 'lodash/includes'
import forEach from 'lodash/forEach'
import merge from 'lodash/merge'

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

export default (config: ConfigType, actionName: string) => {
  const isExcluded = includes(config.exclude, actionName)
  if (isExcluded) return

  const cacheRule = getCacheRule(config.include, actionName)

  if (cacheRule) {
    return {
      name: actionName,
      validity: cacheRule.validity ? cacheRule.validity : config.validity,
      persist: cacheRule.persist !== undefined ? cacheRule.persist : config.persist,
    }
  }
}
