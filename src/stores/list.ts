import Fuse from 'fuse.js'
import { Readable, Writable, derived, writable } from 'svelte/store'

import type { Collection } from './collection'
import * as sort from './sort'
import urlSearchParam from './urlSearchParam'

type Options<T> = {
  weights: Weighted<T>
  queryParam?: string
}

type Weighted<T> = {
  [P in keyof T]?: number
}

export type Store<T> = Readable<T[]> & {
  sort(field: keyof T): () => void
  filter: Writable<string>
}

export default function list<T extends Record<string, unknown>>(
  collection: Readable<Collection<T>>,
  { weights, queryParam }: Options<T>,
): Store<T> {
  const keys = Object.entries(weights).map(([name, weight]) => ({
    name,
    weight: weight || 0,
  }))
  const index = derived(
    collection,
    ($collection) => new Fuse($collection.all, { keys }),
  )

  const sorter = sort.store<keyof T>()

  const filter = writable('')
  filter.subscribe(sorter.reset)
  if (queryParam) {
    urlSearchParam(queryParam, filter)
  }

  const { subscribe } = derived(
    [collection, index, sorter, filter],
    ([$collection, $index, $sort, $filter]) =>
      sortAndFilter($collection.all, $index, $sort, $filter),
  )

  return {
    subscribe,
    sort(field: keyof T) {
      return () => sorter.toggle(field)
    },
    filter,
  }
}

function sortAndFilter<T>(
  collection: T[],
  index: Fuse<T>,
  sorter: sort.Sort<keyof T>,
  filter: string,
): T[] {
  const filtered = filter ? index.search(filter).map((r) => r.item) : collection

  return sort.apply(sorter, filtered)
}