import { createCacheManager } from '../'
import createStore, { LOADING, SUCCESS } from './mocks/store'
import { wait } from 'utils/tests'

describe('Expiration', () => {
  it('should expire', async () => {
    const cacheManager = createCacheManager({ include: [{ name: 'BALANCE/LOAD', validity: 2 }] })
    const store = createStore(cacheManager)
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)

    await wait(2100)
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)
  })

  it('should expire all, but one', async () => {
    const cacheManager = createCacheManager({
      include: [
        { type: 'pattern', name: '/LOAD$' },
        { name: 'PRODUCTS/LOAD', validity: 0 },
      ],
      validity: 2,
    })
    const store = createStore(cacheManager)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })
    store.dispatch({ type: 'PRODUCTS/SUCCESS' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)
    expect(store.getState().products.status).toBe(SUCCESS)

    await wait(2100)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(LOADING)
    expect(store.getState().products.status).toBe(SUCCESS)
  })

  it('should not expire any, but one', async () => {
    const cacheManager = createCacheManager({
      include: [
        { type: 'pattern', name: '/LOAD$' },
        { name: 'PRODUCTS/LOAD', validity: 2 },
      ],
    })
    const store = createStore(cacheManager)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })
    store.dispatch({ type: 'PRODUCTS/SUCCESS' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)
    expect(store.getState().products.status).toBe(SUCCESS)

    await wait(2100)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)
    expect(store.getState().products.status).toBe(LOADING)
  })
})