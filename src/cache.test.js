import Cache from './cache'

describe('with cached value', () => {
  let cache, loader
  beforeEach(() => {
    cache = new Cache()
    cache.set('foo', 5)

    loader = jest.fn().mockReturnValue(
      Promise.resolve([1, 2, 3])
    )
  })

  it('can load from cache', () => {
    return cache.load({
      key: 'foo',
      loader: loader
    }).then(val => {
      expect(val).toEqual(5)
      expect(loader.mock.calls).toHaveLength(0)
    })
  })

  it('can load with the loader', () => {
    return cache.load({
      key: 'bar',
      loader: loader
    }).then(val => {
      expect(val).toEqual([1, 2, 3])
      expect(loader.mock.calls).toHaveLength(1)
      expect(cache.get('foo')).toEqual(5)
    })
  })

  it('can force a reload', () => {
    return cache.load({
      key: 'foo',
      force: true,
      loader: loader
    }).then(val => {
      expect(val).toEqual([1, 2, 3])
      expect(loader.mock.calls).toHaveLength(1)
      expect(cache.get('foo')).toEqual([1, 2, 3])
    })
  })
})
