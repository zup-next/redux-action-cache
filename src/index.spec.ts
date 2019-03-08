import sayHello from './'

test('should sayHello', () => {
  expect(sayHello('redux-action-cache')).toBe('redux-action-cache')
})
