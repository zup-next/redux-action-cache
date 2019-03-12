import CreateCache from '../cache'

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
    await new Promise(resolve => setTimeout(resolve, 2000))
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

  it('Should load cache', async () => {
    const localStorageMock = jest.fn()
    const cache = CreateCache()
    const actionName = 'USER/LOAD'
    cache.createCache({ name: actionName, validity: 1, persist: true })
    await cache.load(localStorageMock)
    expect(localStorageMock).toHaveBeenCalled()
  })
})
