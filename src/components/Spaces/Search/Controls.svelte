<script lang="ts">
  import { Writable } from 'svelte/store'
  import FormulaInput from '../../Shared/FormulaInput.svelte'

  export let text: Writable<string>
  export let formula: Writable<string>
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
    name="formula"
    placeholder="e.g. compact + ~metrizable"
  />
</div>
