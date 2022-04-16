import { beforeEach, describe, expect, it } from 'vitest'
import { FilterStore, filterStore } from './filter'
import { get } from 'svelte/store'

type Object = { id: number; name: string; alias?: string }

const collection: Object[] = [
  { id: 1, name: 'foo', alias: 'bob' },
  { id: 2, name: 'bar' },
  { id: 3, name: 'baz' },
  { id: 4, name: 'quux' },
]

describe('filterStore', () => {
  let store: FilterStore<Object>

  beforeEach(() => {
    store = filterStore(collection, {
      name: 0.8,
      alias: 0.2,
    })
  })

  it('shows the full collection by default', () => {
    expect(get(store.results)).toEqual(collection)
  })

  it('can filter by text', () => {
    store.filter.set('ba')

    expect(get(store.results).map((o) => o.name)).toEqual(['bar', 'baz'])
  })

  it('weights', () => {
    store.filter.set('b')

    expect(get(store.results).map((o) => o.name)).toEqual(['bar', 'baz', 'foo'])
  })

  it('resets to the full collection when clearing', () => {
    store.filter.set('q')
    store.filter.set('')

    expect(get(store.results)).toEqual(collection)
  })
})
