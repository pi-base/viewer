<script lang="ts">
  import { Readable } from 'svelte/store'
  import { formula as F } from '@pi-base/core'

  import { Formula } from '../../../models'
  import ShowFormula from '../../Shared/Formula.svelte'
  import { Store, search as searchStore } from '../../../models/Store'
  import Spaces from '../List.svelte'
  import Table from '../../Traits/Table.svelte'
  import Contradiction from './Contradiction.svelte'
  import Hints from './Hints.svelte'

  export let query: Readable<{ text: string; formula: Formula | null }>
  export let setSearch: (q: string) => void
  export let store: Store

  $: text = $query.text
  $: formula = $query.formula
  $: results = (formula || text) && searchStore(store, { formula, text })
</script>

{#if !formula && !text}
  <Hints {setSearch} />
{:else if formula && results && results.kind === 'contradiction'}
  <Contradiction contradiction={results.contradiction} {formula} />
{:else if results && results.kind !== 'contradiction'}
  <h5>
    Spaces
    {#if text}
      matching <code>{text}</code>
    {/if}
    {#if text && formula}
      and
    {/if}
    {#if formula}
      <!-- TODO: should use the loaded properties -->
      satisfying <ShowFormula value={F.mapProperty((p) => p.uid, formula)} />
    {/if}
  </h5>
  {#if formula}
    <Table
      spaces={results.spaces}
      properties={Array.from(F.properties(formula))}
    />
  {:else}
    <Spaces spaces={results.spaces} />
  {/if}
  <!-- TODO: convince the compiler the else here is impossible -->
{/if}
