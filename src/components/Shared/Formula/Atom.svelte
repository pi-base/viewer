<script lang="ts">
  import { Property, Store } from '../../../models'
  import * as paths from '../../../paths'
  import { getStore } from '../../Svelte'
  import Tex from '../Tex.svelte'

  export let property: Property | string
  export let value: boolean

  let resolved: Property | null

  const store = getStore()
  $: resolved =
    typeof property === 'string' ? Store.property(store, property) : property
  $: prefix = value === false ? '¬' : ''
</script>

{#if resolved}
  <a href={paths.property(resolved)}>
    {prefix}<Tex body={resolved.name} />
  </a>
  <!-- TODO: else -->
{/if}
