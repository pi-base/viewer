import { getContext } from 'svelte'
import { Readable } from 'svelte/store'
import { Store } from './models/Store/state'

export function getStore(): Readable<Store> {
  return getContext('store')
}
