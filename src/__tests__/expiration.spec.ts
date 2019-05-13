import { createCacheManager } from '../'
import createStore, { LOADING, SUCCESS } from './mocks/store'
import { wait } from 'utils/tests'

describe('Expiration', () => {
  it('should expire', async () => {
    const cacheManager = createCacheManager({ include: [{ name: 'BALANCE/LOAD', validity: 1 }] })
    const store = createStore(cacheManager)
    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)

    await wait(1100)
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)
  })

  it('should expire all, but one', async () => {
    const cacheManager = createCacheManager({
      include: [
        { type: 'pattern', name: '/LOAD$' },
        { name: 'PRODUCTS/LOAD', validity: 0 },
      ],
      validity: 1,
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

    await wait(1100)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(LOADING)
    expect(store.getState().products.status).toBe(SUCCESS)
  })

  it('should not expire any, but one', async () => {
    const cacheManager = createCacheManager({
      include: [
        { type: 'pattern', name: '/LOAD$' },
        { name: 'PRODUCTS/LOAD', validity: 1 },
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

    await wait(1100)

    store.dispatch({ type: 'BALANCE/LOAD' })
    store.dispatch({ type: 'PRODUCTS/LOAD' })

    expect(store.getState().balance.status).toBe(SUCCESS)
    expect(store.getState().products.status).toBe(LOADING)
  })

  it('should expire with property', async () => {
    const cacheManager = createCacheManager({ include: [{ name: 'BALANCE/LOAD', validity: 1, withProperties: ['id'] }] })
    const store = createStore(cacheManager)
    store.dispatch({ type: 'BALANCE/LOAD', id: '001' })
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD', id: '001' })

    expect(store.getState().balance.status).toBe(SUCCESS)

    await wait(600)
    store.dispatch({ type: 'BALANCE/LOAD', id: '002' })
    expect(store.getState().balance.status).toBe(LOADING)
    store.dispatch({ type: 'BALANCE/SUCCESS' })

    await wait(600)
    store.dispatch({ type: 'BALANCE/LOAD', id: '001' })
    expect(store.getState().balance.status).toBe(LOADING)
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    store.dispatch({ type: 'BALANCE/LOAD', id: '002' })
    expect(store.getState().balance.status).toBe(SUCCESS)

    await wait(600)
    store.dispatch({ type: 'BALANCE/LOAD', id: '002' })
    expect(store.getState().balance.status).toBe(LOADING)
  })
})
