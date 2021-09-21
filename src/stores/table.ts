import { Readable, derived, writable } from 'svelte/store'

export type TableStore<T> = {
  sort(field: Field<T>): void
} & Readable<T[]>

export type Field<T> = string & keyof T
export type Direction = 'asc' | 'desc'

type State<T> = {
  field: Field<T>
  direction: Direction
} | null

export function tableStore<T>({
  collection,
}: {
  collection: T[]
}): TableStore<T> {
  const state = writable<State<T>>(null)

  const { subscribe } = derived(state, ($state) =>
    $state ? sort(collection, $state.field, $state.direction) : collection
  )

  function sortOn(field: Field<T>) {
    state.update(($state) => {
      const direction =
        $state?.field === field && $state?.direction === 'asc' ? 'desc' : 'asc'
      return { field, direction }
    })
  }

  return {
    sort: sortOn,
    subscribe,
  }
}

function sort<T>(
  collection: T[],
  field: Field<T> | null,
  direction: Direction
): T[] {
  if (!field) {
    return collection
  }

  return collection.sort((a, b) => compare(direction, a[field], b[field]))
}

function compare(direction: Direction, a: any, b: any) {
  if (a === b) {
    return 0
  }

  return (direction === 'asc' ? 1 : -1) * (a > b ? 1 : -1)
}
