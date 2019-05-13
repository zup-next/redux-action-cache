import CreateCache, { cachePersistName } from '../cache'
import { wait } from '../utils/tests'

describe('Cache Object', () => {
  it('Should create cache', () => {
    const cache = CreateCache()
    const type = 'USER/LOAD'
    cache.createCache({ action: { type }, validity: 3000, persist: true })
    const cacheObject = cache.getCacheByAction(type)
    expect(cacheObject.validity).toBe(3000)
    expect(cacheObject.persist).toBeTruthy()
  })

  it('Should remove cache', () => {
    const cache = CreateCache()
    const type = 'USER/LOAD'
    cache.createCache({ action: { type }, validity: 3000, persist: true })
    cache.removeCache(type)
    expect(cache.getCacheByAction(type)).toEqual({})
  })

  it('should remove array of cache', () => {
    const cache = CreateCache()
    const actionTypes = ['USER/LOAD', 'USER/SAVE']
    cache.createCache({ action: { type: actionTypes[0] }, validity: 1, persist: true })
    cache.createCache({ action: { type: actionTypes[1] }, validity: 1, persist: false })
    cache.removeCache(actionTypes)
    expect(cache.getCacheByAction(actionTypes[0])).toEqual({})
    expect(cache.getCacheByAction(actionTypes[1])).toEqual({})
  })

  it('Should isActionCached be true ', () => {
    const cache = CreateCache()
    const type = 'USER/LOAD'
    cache.createCache({ action: { type }, validity: 3000, persist: true })
    expect(cache.isActionCached({ type })).toBeTruthy()
  })

  it('Should isActionCached be false ', async () => {
    const cache = CreateCache()
    const type = 'USER/LOAD'
    cache.createCache({ action: { type }, validity: 1, persist: true })
    await wait(2000)
    expect(cache.isActionCached({ type })).toBeFalsy()
  })

  it('Should persist cache', async () => {
    const localStorageMock = jest.fn()
    const cache = CreateCache()
    const type = 'USER/LOAD'
    cache.createCache({ action: { type }, validity: 1, persist: true })
    await cache.persist(localStorageMock)
    expect(localStorageMock).toHaveBeenCalled()
  })

  it('Should persist cache flagged true', async () => {
    const localStorageMock = jest.fn()
    const cache = CreateCache()
    const persistActionType = 'USER/LOAD'
    const notPersistActionType = 'USER/SAVE'
    cache.createCache({ action: { type: persistActionType }, validity: 1, persist: true })
    cache.createCache({ action: { type: notPersistActionType }, validity: 1, persist: false })
    await cache.persist(localStorageMock)
    const persistedCache = { [persistActionType]: cache.getCacheByAction(persistActionType) }
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
