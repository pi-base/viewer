<script lang="ts">
  import { Space } from '../../models'
  import { Tex } from '../Shared'
  import { theoremsWithCounterexample } from '../../models/Store'
  import Theorems from '../Theorems/SummaryList.svelte'
  import { getStore } from '../Svelte'

  export let space: Space

  $: store = getStore()
  $: theorems = theoremsWithCounterexample(store, space)
</script>

{#if theorems.length > 0}
  <p>
    <Tex body={space.name} /> is a counterexample to the converse of {theorems.length}
    theorems:
  </p>
  <Theorems {theorems} />
{:else}
  <Tex body={space.name} /> is not a counterexample for any recorded theorems
{/if}
