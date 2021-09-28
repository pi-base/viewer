import { Readable, derived, get, writable, Writable } from 'svelte/store'
import { replaceEnd } from '../util'

export type Suggestions = {
  suggestions: string[]
  selected?: number
}

export type SuggestionStore = Readable<Suggestions> & {
  apply(): void
  next(): void
  prev(): void
  run(value: string): void
}

export function suggestionStore(
  value: Writable<string>,
  suggest: (fragment: string) => string[]
): SuggestionStore {
  const suggestions = writable([] as string[])
  const selected = writable<number | undefined>(undefined)

  function apply(index?: number) {
    const $suggestions = get(suggestions)
    if ($suggestions.length === 0) {
      return
    }

    const i = index ?? get(selected)
    if (i === undefined) {
      return
    }

    const suggestion = $suggestions[mod(i, $suggestions.length)]
    if (!suggestion) {
      return
    }

    value.update(($value) => applySuggestion($value, suggestion))
    selected.set(undefined)
    suggestions.set([])
  }

  function run(s: string) {
    value.set(s)

    const fragment = getFragment(s)
    suggestions.set(fragment ? suggest(fragment) : [])
    selected.set(undefined)
  }

  const { subscribe } = derived(
    [suggestions, selected],
    ([$suggestions, $selected]) => ({
      selected: $selected,
      suggestions: $suggestions,
    })
  )

  return {
    apply,
    next() {
      selected.update((n) => (n ?? -1) + 1)
    },
    prev() {
      selected.update((n) => (n ?? 0) - 1)
    },
    run,
    subscribe,
  }
}

export function applySuggestion(current: string, suggestion: string) {
  if (current === '') {
    return ''
  }
  const frag = getFragment(current)
  if (frag === '') {
    return current
  }
  return replaceEnd(current, frag, suggestion)
}

const separatorExp = /[~+&|()!?]/

function getFragment(str: string): string {
  if (!str) {
    return ''
  }

  const parts = str.split(separatorExp)
  return parts[parts.length - 1].trimLeft()
}

function mod(a: number, n: number) {
  // Handle negative a's
  return ((a % n) + n) % n
}
