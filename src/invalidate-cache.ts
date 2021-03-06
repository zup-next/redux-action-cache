import reduce from 'lodash/reduce'
import { InvalidationRule, Invalidations, Action } from './types'

const invalidateByPattern = (actionName: string, rule: InvalidationRule) => {
  if (actionName.match(rule.invalidatedBy)) {
    const invalidated = rule.invalidated instanceof Array ? rule.invalidated[0] : rule.invalidated
    return [actionName.replace(rule.invalidatedBy, invalidated)]
  }

  return []
}

const invalidateByAction = (actionName: string, rule: InvalidationRule) => {
  if (actionName === rule.invalidatedBy) {
    return typeof rule.invalidated === 'string' ? [rule.invalidated] : rule.invalidated
  }

  return []
}

const defaultInvalidation = (invalidationRules: Invalidations, actionName: string) =>
  reduce(invalidationRules, (result: Array<string>, rule: InvalidationRule) => {
    let invalidated
    if (rule.type === 'pattern') invalidated = invalidateByPattern(actionName, rule)
    else invalidated = invalidateByAction(actionName, rule)

    return [...result, ...invalidated]
  }, [])

export default (invalidationRules: Invalidations, action: Action) =>
  typeof invalidationRules === 'function'
    ? invalidationRules(action)
    : defaultInvalidation(invalidationRules, action.type)
