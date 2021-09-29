<script lang="ts">
  import { getStore } from '../../context'
  import Detail from './Detail.svelte'
  import { NotFound } from '../Shared'
  import { default as S } from '../../models/Store'

  export let spaceId: string
  export let propertyId: string

  const store = getStore()
  $: space = S.space($store, spaceId)
  $: property = S.property($store, propertyId)
  $: trait = S.trait($store, { space: spaceId, property: propertyId })
</script>

{#if space && property && trait}
  <Detail {space} {property} {trait} />
{:else}
  <NotFound />
{/if}
