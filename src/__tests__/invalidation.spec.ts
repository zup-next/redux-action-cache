import { createCacheManager } from '../'
import createStore, { NOT_LOADED, LOADING, ERROR, SUCCESS } from './mocks/store'
import snakeCase from 'lodash/snakeCase'
import { Store } from '../types'

const testErrorInvalidation = (store: Store, resource: string) => {
  const namespace = snakeCase(resource).toUpperCase()

  expect(store.getState()[resource].status).toBe(NOT_LOADED)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(LOADING)

  store.dispatch({ type: `${namespace}/ERROR` })
  expect(store.getState()[resource].status).toBe(ERROR)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(LOADING)
}

describe('Invalidation', () => {
  it('should invalidate cache', () => {
    const cacheManager = createCacheManager({
      include: ['BALANCE/LOAD'],
      invalidations: [{ invalidatedBy: 'BALANCE/ERROR', invalidated: 'BALANCE/LOAD' }],
    })
    const store = createStore(cacheManager)
    testErrorInvalidation(store, 'balance')
  })

  it('should invalidate multiple caches', () => {
    const cacheManager = createCacheManager({
      include: [{ type: 'pattern', name: '/LOAD$' }],
      invalidations: [{ invalidatedBy: 'ORDER/CREATE_SUCCESS', invalidated: ['BALANCE/LOAD', 'ORDER/LOAD'] }],
    })
    const store = createStore(cacheManager)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'ORDER/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)
    expect(store.getState().order.status).toBe(LOADING)

    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'ORDER/SUCCESS' })
    expect(store.getState().balance.status).toBe(SUCCESS)
    expect(store.getState().order.status).toBe(SUCCESS)

    store.dispatch({ type: 'ORDER/CREATE_SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'ORDER/LOAD' })

    expect(store.getState().balance.status).toBe(LOADING)
    expect(store.getState().order.status).toBe(LOADING)
  })

  it('should invalidate cache by pattern', () => {
    const cacheManager = createCacheManager({
      include: [{ type: 'pattern', name: '/LOAD$' }],
      invalidations: [{ type: 'pattern', invalidatedBy: /(.+)\/ERROR/, invalidated: '$1/LOAD' }],
    })
    const store = createStore(cacheManager)

    testErrorInvalidation(store, 'balance')
    testErrorInvalidation(store, 'userData')
    testErrorInvalidation(store, 'products')
    testErrorInvalidation(store, 'order')
  })

  it('should invalidate cache using a custom function', () => {
    const cacheManager = createCacheManager({
      include: [{ type: 'pattern', name: '/LOAD$' }],
      invalidations: (action) =>
        action.type.match('/ERROR$') ? [action.type.replace('ERROR', 'LOAD')] : [],
    })
    const store = createStore(cacheManager)

    testErrorInvalidation(store, 'balance')
    testErrorInvalidation(store, 'userData')
    testErrorInvalidation(store, 'products')
    testErrorInvalidation(store, 'order')
  })

  it('should force cache invalidation', () => {
    const cacheManager = createCacheManager({ include: ['BALANCE/LOAD'] })
    const store = createStore(cacheManager)

    expect(store.getState().balance.status).toBe(NOT_LOADED)

    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)

    store.dispatch({ type: 'BALANCE/SUCCESS' })
    expect(store.getState().balance.status).toBe(SUCCESS)

    cacheManager.invalidateCacheFor('BALANCE/LOAD')
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)
  })
})
