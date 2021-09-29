<script lang="ts">
  import { Formula as F } from '@pi-base/core'
  import { mapProperty } from '@pi-base/core/lib/Formula'

  import { Property, Theorem } from '../../../models'
  import { Formula } from '../../Shared'
  import TheoremSummary from '../../Theorems/SummaryList.svelte'

  export let formula: F<Property>
  export let contradiction: Theorem[] | 'tautology'
</script>

{#if contradiction === 'tautology'}
  <h5>
    <!-- TODO: should use the resolved properties -->
    <Formula value={mapProperty((p) => p.uid, formula)} /> is a contradiction
  </h5>
{:else}
  <h5>
    <!-- TODO: should use the resolved properties -->
    <Formula value={mapProperty((p) => p.uid, formula)} /> is impossible by
  </h5>
  <TheoremSummary theorems={contradiction} />
{/if}
