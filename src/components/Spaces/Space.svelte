<script lang="ts">
  import { default as S } from '../../models/Store'
  import Detail from './Detail.svelte'
  import { NotFound } from '../Shared'
  import { getStore } from '../../context'

  export let id: string
  export let tab: 'theorems' | 'properties' | 'references' = 'theorems'

  const store = getStore()
  $: space = S.space($store, id)
</script>

{#if space}
  <Detail {space} {tab} />
{:else}
  <NotFound />
{/if}
