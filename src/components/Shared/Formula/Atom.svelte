<script lang="ts">
  import { Link } from 'svelte-routing'
  import { Property, Store } from '../../../models'
  import * as paths from '../../../paths'
  import { getStore } from '../../../context'
  import Tex from '../Tex.svelte'
  import NotFound from '../NotFound.svelte'

  export let property: Property | string
  export let value: boolean

  let resolved: Property | null

  const store = getStore()
  $: resolved =
    typeof property === 'string' ? Store.property($store, property) : property
  $: prefix = value === false ? '¬' : ''
</script>

{#if resolved}
  <Link to={paths.property(resolved)}>
    {prefix}<Tex body={resolved.name} />
  </Link>
{:else}
  <NotFound />
{/if}
