import { createCacheManager } from '../'
import createStore, { actionTypes } from './mocks/store'

describe('create cache for action', () => {
  let store

  beforeEach(() => {
    store = createStore()
  })

  it('should cache action', () => {

  })

  it('should cache action by pattern', () => {

  })

  it('should not cache unregistered action', () => {

  })

  it('should not cache excluded action', () => {

  })
})
