import { get } from 'svelte/store'
import { reducerStore } from './reducer'

it('updates using the reducer', () => {
  const store = reducerStore<number[], number>(
    (acc, val) => acc.concat(val),
    []
  )

  store.dispatch(1)
  store.dispatch(2)
  store.dispatch(3)
  store.dispatch(4)

  expect(get(store)).toEqual([1, 2, 3, 4])
})
