import { Readable } from 'svelte/store'

export function onChange<S>(
  store: Readable<S>,
  callback: (current: S) => void
) {
  let prev: S | undefined = undefined

  store.subscribe((next) => {
    if (prev !== undefined && prev !== next) {
      callback(next)
    }

    prev = next
  })
}
