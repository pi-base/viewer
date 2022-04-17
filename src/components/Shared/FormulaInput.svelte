<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { getStore } from '../../context'
  import { suggestionStore } from '../../stores/suggestions'
  import { searchProperties } from '../../models/Store/state'
  import Suggestions from './FormulaInput/Suggestions.svelte'
  import type { Property } from '@pi-base/core'

  export let value: Writable<string>
  export let name: string
  export let placeholder: string | undefined = undefined

  const store = getStore()
  $: suggestions = suggestionStore(value, (term) =>
    searchProperties($store, term)
      .slice(0, 10)
      .map((p: Property) => p.name)
  )

  function onkeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        return suggestions.next()
      case 'ArrowUp':
        return suggestions.prev()
      case 'Enter':
        event.preventDefault()
      // fall through
      case 'ArrowRight':
        return suggestions.apply()
    }
  }

  function oninput(e: Event) {
    if ((<InputEvent>e).data !== ' ') {
      suggestions.run((<HTMLInputElement>e.target).value)
    }
  }
</script>

<input
  on:keydown={onkeydown}
  on:input={oninput}
  value={$value}
  class="form-control"
  autocomplete="off"
  {name}
  {placeholder}
/>

<Suggestions {...$suggestions} apply={suggestions.apply} />
