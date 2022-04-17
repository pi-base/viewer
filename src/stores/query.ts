import { onDestroy, onMount } from 'svelte'
import type { Unsubscriber, Writable } from 'svelte/store'

export function syncOnMount(param: string, store: Writable<string>) {
  let unsubscribe: Unsubscriber

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has(param)) {
      const value = urlParams.get(param) || ''
      store.set(value)
    }

    unsubscribe = store.subscribe(($value) => {
      const urlParams = new URLSearchParams(window.location.search)
      const current = urlParams.get(param)

      if ($value === current) {
        return
      }

      if ($value) {
        urlParams.set(param, $value)
      } else {
        urlParams.delete(param)
      }

      const search = urlParams.toString()
      const suffix = search ? `?${search}` : ''

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${suffix}`
      )
    })
  })

  onDestroy(() => {
    unsubscribe && unsubscribe()
  })
}
