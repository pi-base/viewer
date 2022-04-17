import { getContext } from 'svelte'
import type { Readable } from 'svelte/store'
import type { Store } from './models/Store/state'

export function getStore(): Readable<Store> {
  return getContext('store')
}
