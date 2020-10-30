import { Readable, derived } from 'svelte/store'
import { idToInt } from '../util'

export type Collection<V, K = number> = {
  all: V[]
  find(id: K): V | null
}

export function index<V, K, I extends K>(
  items: V[],
  key: (item: V) => K,
  normalize: (input: I) => K,
): Collection<V, K> {
  const index = new Map(items.map((item) => [key(item), item]))

  return {
    get all() {
      return Array.from(index.values())
    },
    find(id: I) {
      return index.get(normalize(id)) || null
    },
  }
}

export function indexByUid<T extends { uid: string }>(
  items: T[],
): Collection<T, number | string> {
  return index(
    items,
    (i) => idToInt(i.uid),
    (input: number | string) => {
      if (typeof input === 'string') {
        return idToInt(input)
      } else {
        return input
      }
    },
  )
}

export function collect<S, T extends { uid: string }>(
  remote: Readable<S | undefined>,
  project: (data: S) => T[],
): Readable<Collection<T>> {
  return derived(remote, ($remote) =>
    indexByUid($remote ? project($remote) : []),
  )
}
