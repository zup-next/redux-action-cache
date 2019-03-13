import { createCacheManager } from '../'
import createStore, { NOT_LOADED, LOADING, SUCCESS } from './mocks/store'

describe('create cache for action', () => {
  it('should cache action', () => {
    const cacheManager = createCacheManager({ include: ['BALANCE/LOAD'] })
    const store = createStore(cacheManager)
    expect(store.getState().balance.status).toBe(NOT_LOADED)
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(LOADING)
    store.dispatch({ type: 'BALANCE/SUCCESS' })
    expect(store.getState().balance.status).toBe(SUCCESS)
    store.dispatch({ type: 'BALANCE/LOAD' })
    expect(store.getState().balance.status).toBe(SUCCESS)
  })

  it('should cache action by pattern', () => {

  })

  it('should not cache unregistered action', () => {

  })

  it('should not cache excluded action', () => {

  })
})
