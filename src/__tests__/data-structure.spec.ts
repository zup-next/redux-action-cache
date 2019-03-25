import CreateCache, { cachePersistName } from '../cache'
import { wait } from '../utils/tests'

describe('Cache Object', () => {
  it('Should create cache', () => {
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 3000, persist: true })
    const cacheObject = cache.getCacheByAction(actionName)
    expect(cacheObject.validity).toBe(3000)
    expect(cacheObject.persist).toBeTruthy()
  })

  it('Should remove cache', () => {
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 3000, persist: true })
    cache.removeCache(actionName)
    expect(cache.getCacheByAction(actionName)).toEqual({})
  })

  it('should remove array of cache', () => {
    const cache = CreateCache()
    const actions = ['USER/LOAD', 'USER/SAVE']
    cache.createCache({ name: actions[0], validity: 1, persist: true })
    cache.createCache({ name: actions[1], validity: 1, persist: false })
    cache.removeCache(actions)
    expect(cache.getCacheByAction(actions[0])).toEqual({})
    expect(cache.getCacheByAction(actions[1])).toEqual({})
  })

  it('Should isActionCached be true ', () => {
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 3000, persist: true })
    expect(cache.isActionCached(actionName)).toBeTruthy()
  })

  it('Should isActionCached be false ', async () => {
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 1, persist: true })
    await wait(2000)
    expect(cache.isActionCached(actionName)).toBeFalsy()
  })

  it('Should persist cache', async () => {
    const localStorageMock = jest.fn()
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 1, persist: true })
    await cache.persist(localStorageMock)
    expect(localStorageMock).toHaveBeenCalled()
  })

  it('Should persist cache flagged true', async () => {
    const localStorageMock = jest.fn()
    const cache = CreateCache()
    const persistActionName = 'USER/LOAD'
    const notPersistActionName = 'USER/SAVE'
    cache.createCache({ name: persistActionName, validity: 1, persist: true })
    cache.createCache({ name: notPersistActionName, validity: 1, persist: false })
    await cache.persist(localStorageMock)
    const persistedCache = { [persistActionName]: cache.getCacheByAction(persistActionName) }
    expect(localStorageMock).toHaveBeenCalledWith(cachePersistName, JSON.stringify(persistedCache))
  })

  it('Should load cache', async () => {
    const actionName = 'USER/LOAD'
    const cacheObject = { lastUpdate: '', validity: 1, persist: true }
    const localStorageMock = jest.fn(() => JSON.stringify({ [actionName]: cacheObject }))
    const cache = CreateCache()
    await cache.load(localStorageMock)
    expect(cache.getCacheByAction(actionName)).toEqual(cacheObject)
  })
})
