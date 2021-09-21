import { get } from 'svelte/store'
import { TableStore, tableStore } from './table'

type Object = { id: number; chr: string }

const collection = [
  { id: 2, chr: 'x' },
  { id: 1, chr: 'y' },
  { id: 3, chr: 'w' },
  { id: 4, chr: 'z' },
]

describe('tableStore', () => {
  let store: TableStore<Object>

  beforeEach(() => {
    store = tableStore({ collection })
  })

  it('is unsorted initially', () => {
    expect(get(store)).toEqual(collection)
  })

  it('can sort on id', () => {
    store.sort('id')

    expect(get(store).map((o) => o.id)).toEqual([1, 2, 3, 4])
  })

  it('can reverse sort order', () => {
    store.sort('id')
    store.sort('id')

    expect(get(store).map((o) => o.id)).toEqual([4, 3, 2, 1])
  })

  it('overwrites sorts on different fields', () => {
    store.sort('id')
    store.sort('chr')

    expect(get(store).map((o) => o.chr)).toEqual(['w', 'x', 'y', 'z'])
  })
})
