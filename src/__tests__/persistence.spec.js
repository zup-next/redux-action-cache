import { createCacheManager } from '../'
import createStore, { NOT_LOADED, LOADING, SUCCESS } from './mocks/store'
import { wait } from 'utils/tests'

const DELAY = 10

const createSynchronousStorage = () => {
  const values = {}

  return {
    setItem: (key, value) => {
      values[key] = value
    },
    getItem: key => values[key],
  }
}

const createAsynchronousStorage = () => {
  const values = {}

  return {
    setItem: (key, value) => new Promise(resolve => setTimeout(() => {
      values[key] = value
      resolve()
    }, DELAY)),
    getItem: key => new Promise(resolve => setTimeout(() => resolve(values[key]), DELAY)),
  }
}

const createStorage = isAsync => isAsync ? createAsynchronousStorage() : createSynchronousStorage()

const shouldPersist = async (isAsync) => {
  const storage = createStorage(isAsync)
  const cacheManagerSettings = {
    include: [{ name: 'BALANCE/LOAD', persist: true }],
    storage,
  }

  // start and load balance
  let cacheManager = createCacheManager(cacheManagerSettings)
  let store = createStore(cacheManager)
  store.dispatch({ type: 'BALANCE/LOAD' })

  if (isAsync) await wait(DELAY)

  // restart
  cacheManager = createCacheManager(cacheManagerSettings)
  store = createStore(cacheManager)

  if (isAsync) await wait(DELAY)

  // cache for loading balance should still be available, BALANCE/LOAD should be ignored
  store.dispatch({ type: 'BALANCE/LOAD' })
  expect(store.getState().balance.status).toBe(NOT_LOADED)
}

const shouldPersistAllButOne = async (isAsync) => {
  const storage = createStorage(isAsync)
  const cacheManagerSettings = {
    include: [
      { type: 'pattern', name: '/LOAD$' },
      { name: 'PRODUCTS/LOAD', persist: false },
    ],
    persist: true,
    storage,
  }

  // start and load
  let cacheManager = createCacheManager(cacheManagerSettings)
  let store = createStore(cacheManager)

  store.dispatch({ type: 'BALANCE/LOAD' })
  store.dispatch({ type: 'USER_DATA/LOAD' })
  store.dispatch({ type: 'PRODUCTS/LOAD' })

  if (isAsync) await wait(DELAY)

  // restart
  cacheManager = createCacheManager(cacheManagerSettings)
  store = createStore(cacheManager)

  if (isAsync) await wait(DELAY)

  // persisted caches should still be available
  store.dispatch({ type: 'BALANCE/LOAD' })
  store.dispatch({ type: 'USER_DATA/LOAD' })
  store.dispatch({ type: 'PRODUCTS/LOAD' })

  expect(store.getState().balance.status).toBe(NOT_LOADED)
  expect(store.getState().userData.status).toBe(NOT_LOADED)
  expect(store.getState().products.status).toBe(LOADING)
}

const shouldNotPersistAnyButOne = async (isAsync) => {
  const storage = createStorage(isAsync)
  const cacheManagerSettings = {
    include: [
      { type: 'pattern', name: '/LOAD$' },
      { name: 'PRODUCTS/LOAD', persist: true },
    ],
    storage,
  }

  // start and load
  let cacheManager = createCacheManager(cacheManagerSettings)
  let store = createStore(cacheManager)

  store.dispatch({ type: 'BALANCE/LOAD' })
  store.dispatch({ type: 'USER_DATA/LOAD' })
  store.dispatch({ type: 'PRODUCTS/LOAD' })

  if (isAsync) await wait(DELAY)

  // restart
  cacheManager = createCacheManager(cacheManagerSettings)
  store = createStore(cacheManager)

  if (isAsync) await wait(DELAY)

  // persisted caches should still be available
  store.dispatch({ type: 'BALANCE/LOAD' })
  store.dispatch({ type: 'USER_DATA/LOAD' })
  store.dispatch({ type: 'PRODUCTS/LOAD' })

  expect(store.getState().balance.status).toBe(LOADING)
  expect(store.getState().userData.status).toBe(LOADING)
  expect(store.getState().products.status).toBe(NOT_LOADED)
}

describe('Persistence', () => {
  it('sync: should persist', () => shouldPersist(false))

  it('sync: should persist all, but one', () => shouldPersistAllButOne(false))

  it('sync: should not persist any, but one', () => shouldNotPersistAnyButOne(false))

  it('async: should persist', () => shouldPersist(true))

  it('async: should persist all, but one', () => shouldPersistAllButOne(true))

  it('async: should not persist any, but one', () => shouldNotPersistAnyButOne(true))

  it('async: should run with empty cache if storage has delayed and update cache when it\'s finally loaded', async () => {
    const storage = createAsynchronousStorage()
    const cacheManagerSettings = {
      include: [{ type: 'pattern', name: '/LOAD$' }],
      persist: true,
      storage,
    }

    // start and load
    let cacheManager = createCacheManager(cacheManagerSettings)
    let store = createStore(cacheManager)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    await wait(DELAY)

    // restart
    cacheManager = createCacheManager(cacheManagerSettings)
    store = createStore(cacheManager)

    // persisted cache should not be loaded yet, should behave like no cache is available
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)

    await wait(DELAY)

    // persisted cache is loaded now, should identify the cache
    store.dispatch({ type: 'PRODUCTS/LOAD' })
    expect(store.getState().products.status).toBe(NOT_LOADED)
  })

  it('async: should retain most recent expiration data when storage is delayed', async () => {
    const storage = createAsynchronousStorage()
    const cacheManagerSettings = {
      include: ['BALANCE/LOAD'],
      validity: 1,
      persist: true,
      storage,
    }

    // start and load
    let cacheManager = createCacheManager(cacheManagerSettings)
    let store = createStore(cacheManager)

    store.dispatch({ type: 'BALANCE/LOAD' })

    await wait(500)

    // restart
    cacheManager = createCacheManager(cacheManagerSettings)
    store = createStore(cacheManager)
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })

    await wait(600)

    /* Persisted cache is loaded now. The most recent cache information for 'BALANCE/LOAD' is
    already in the cache object, the cache information for 'BALANCE/LOAD' persisted in the storage
    that has just been loaded should be ignored. It means that, even though more than one second
    (validity) has passed since we first dispatched 'BALANCE/LOAD', it should still be valid */
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(SUCCESS)
  })
})
