<script lang="ts">
  import { Theorem } from '../../models'
  import { Store } from '../../models/Store/state'
  import * as paths from '../../paths'
  import SummaryList from './SummaryList.svelte'
  import TraitTable from '../Traits/Table.svelte'
  import { getStore } from '../Svelte'
  import { findConverse } from '../../models/findConverse'

  export let theorem: Theorem

  const store: Store = getStore()

  $: result = findConverse(store, theorem)
</script>

{#if !result}
  <p>
    Could not find any counterexamples to the converse. If you know of one,
    consider <a href={paths.contributeExample()}>contributing it</a>.
  </p>
{:else if result.kind === 'holds'}
  <p>The converse holds, by</p>
  <SummaryList theorems={result.theorems} />
{:else if result.kind === 'counterexample_found'}
  <p>The converse does not hold, as witnessed by</p>
  <TraitTable spaces={result.spaces} properties={result.properties} />
{/if}
