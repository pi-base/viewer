<script lang="ts">
  import { default as S } from '../../models/Store'
  import Detail from './Detail.svelte'
  import { NotFound } from '../Shared'
  import { getStore } from '../../context'

  export let id: string
  export let tab: 'converse' | 'references' = 'converse'

  const store = getStore()
  $: theorem = S.theorem($store, id)
</script>

{#if theorem}
  <Detail {theorem} {tab} />
{:else}
  <NotFound />
{/if}
