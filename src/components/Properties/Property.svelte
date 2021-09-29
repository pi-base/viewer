<script lang="ts">
  import { default as S } from '../../models/Store'
  import Detail from './Detail.svelte'
  import { NotFound } from '../Shared'
  import { getStore } from '../../context'

  export let id: string
  export let tab: 'theorems' | 'spaces' | 'references' = 'theorems'

  const store = getStore()
  $: property = S.property($store, id)
</script>

{#if property}
  <Detail {property} {tab} />
{:else}
  <NotFound />
{/if}
