import Fuse from 'fuse.js'
import { Readable, Writable, derived, writable } from 'svelte/store'

export type FilterStore<T> = {
  collection: Writable<T[]>
  filter: Writable<string>
  results: Readable<T[]>
}

export type Weights<T> = { [P in keyof T]?: number }

export function filterStore<T>(
  collection: T[],
  weights: Weights<T>
): FilterStore<T> {
  const objects = writable(collection)

  const index = derived(
    objects,
    ($objects) =>
      new Fuse($objects, {
        isCaseSensitive: true,
        shouldSort: true,
        threshold: 0.4,
        keys: weightsToKeys(weights),
      })
  )

  const filter = writable('')

  const results = derived(
    [objects, index, filter],
    ([$objects, $index, $filter]) =>
      $filter === '' ? $objects : $index.search($filter).map((r) => r.item)
  )

  const result: FilterStore<T> = {
    collection: objects,
    filter,
    results,
  }

  return result
}

function weightsToKeys<T>(
  weights: Weights<T>
): { name: string; weight: number }[] {
  return Object.entries<number>(
    weights as Record<string, number>
  ).map(([name, weight]) => ({ name, weight }))
}
