<script lang="ts">
  import type { Writable } from 'svelte/store'
  import FormulaInput from '../../Shared/FormulaInput.svelte'
  import { syncOnMount } from '../../../stores/query'

  export let text: Writable<string>
  export let formula: Writable<string>

  syncOnMount('text', text)
  syncOnMount('q', formula)
</script>

<div class="form-group">
  <label class="form-label" for="text">Filter by Text</label>
  <input
    bind:value={$text}
    name="text"
    placeholder="e.g. plank"
    class="form-control"
  />
</div>

<div class="form-group">
  <label class="form-label" for="text">Filter by Formula</label>
  <FormulaInput
    value={formula}
    name="q"
    placeholder="e.g. compact + ~metrizable"
  />
</div>
