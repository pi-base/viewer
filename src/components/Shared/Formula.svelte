<script lang="ts">
  import { Link } from 'svelte-routing'
  import type * as F from '@pi-base/core/lib/Formula'
  import Typeset from './Typeset.svelte'
  import type { Property } from '../../types'

  export let value: F.Formula<Property>
</script>

{#if value.kind === 'atom'}
  {value.value ? '' : '¬'}
  <Link to="/properties/{value.property.uid}">
    <Typeset body={value.property.name} />
  </Link>
{:else if value.kind === 'and'}
  {#each value.subs as f, i}
    <svelte:self value={f} />
    {i === value.subs.length - 1 ? '' : '∧'}
  {/each}
{:else}
  {#each value.subs as f, i}
    <svelte:self value={f} />
    {i === value.subs.length - 1 ? '' : '∨'}
  {/each}
{/if}
