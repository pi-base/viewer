import { expect, it } from 'vitest'
import { onChange } from './onChange'
import { writable } from 'svelte/store'

it('registers changes', () => {
  const store = writable('x')
  let n = 0

  onChange(store, () => (n = n + 1))

  store.set('a')
  store.set('a')
  store.set('b')
  store.set('b')
  store.set('b')
  store.set('a')

  expect(n).toEqual(3)
})

it('does not run on initial subscribe', () => {
  const store = writable('x')
  let n = 0

  onChange(store, () => (n = n + 1))

  expect(n).toEqual(0)
})
