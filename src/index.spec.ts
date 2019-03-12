import { createCacheManager } from './'

test('should import', () => {
  expect(typeof createCacheManager).toBe('function')
})
