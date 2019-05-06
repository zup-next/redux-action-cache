import { createCacheManager } from '../'
import createStore, { NOT_LOADED, LOADING, SUCCESS } from './mocks/store'
import snakeCase from 'lodash/snakeCase'
import { Store } from '../types'

const testCachedResource = (store: Store, resource: string) => {
  const namespace = snakeCase(resource).toUpperCase()

  expect(store.getState()[resource].status).toBe(NOT_LOADED)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(LOADING)

  store.dispatch({ type: `${namespace}/SUCCESS` })
  expect(store.getState()[resource].status).toBe(SUCCESS)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(SUCCESS)
}

const testUncachedResource = (store: Store, resource: string) => {
  const namespace = snakeCase(resource).toUpperCase()

  expect(store.getState()[resource].status).toBe(NOT_LOADED)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(LOADING)

  store.dispatch({ type: `${namespace}/SUCCESS` })
  expect(store.getState()[resource].status).toBe(SUCCESS)

  store.dispatch({ type: `${namespace}/LOAD` })
  expect(store.getState()[resource].status).toBe(LOADING)
}

describe('create cache for action', () => {
  it('should cache action', () => {
    const cacheManager = createCacheManager({ include: ['BALANCE/LOAD'] })
    const store = createStore(cacheManager)
    testCachedResource(store, 'balance')
  })

  it('should cache actions by pattern', () => {
    const cacheManager = createCacheManager({ include: [{ type: 'pattern', name: '/LOAD$' }] })
    const store = createStore(cacheManager)
    testCachedResource(store, 'balance')
    testCachedResource(store, 'userData')
    testCachedResource(store, 'products')
    testCachedResource(store, 'order')
  })

  it('should not cache unregistered action', () => {
    const cacheManager = createCacheManager({ include: ['BALANCE/LOAD'] })
    const store = createStore(cacheManager)
    testUncachedResource(store, 'products')
  })

  it('should not cache unregistered action (pattern)', () => {
    const cacheManager = createCacheManager({ include: [{ type: 'pattern', name: '/LOAD$' }] })
    const store = createStore(cacheManager)

    expect(store.getState().order.createStatus).toBe(NOT_LOADED)

    store.dispatch({ type: 'ORDER/CREATE' })
    expect(store.getState().order.createStatus).toBe(LOADING)

    store.dispatch({ type: 'ORDER/CREATE_SUCCESS' })
    expect(store.getState().order.createStatus).toBe(SUCCESS)

    store.dispatch({ type: 'ORDER/CREATE' })
    expect(store.getState().order.createStatus).toBe(LOADING)
  })

  it('should not cache excluded action', () => {
    const cacheManager = createCacheManager({
      include: [{ type: 'pattern', name: '/LOAD$' }],
      exclude: ['PRODUCTS/LOAD'],
    })
    const store = createStore(cacheManager)
    testUncachedResource(store, 'products')
  })
})
