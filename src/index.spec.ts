import sayHello from './index'

test('should sayHello', () => {
  expect(sayHello('redux-action-cache')).toBe('redux-action-cache')
})
