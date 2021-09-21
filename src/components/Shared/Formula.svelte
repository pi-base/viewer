<script lang="ts">
  import Atom from './Formula/Atom.svelte'
  import { Formula } from '@pi-base/core'

  export let value: Formula<string>
</script>

{#if value.kind === 'atom'}
  <Atom {...value} />
{:else}
  <!-- The somewhat awkward spacing here is s.t. there is no whitespace around
    the parens -->
  ({#each value.subs as subformula, index}
    <svelte:self
      value={subformula}
    />{#if index !== value.subs.length - 1}{value.kind === 'and'
        ? ' Λ '
        : ' ∨ '}{/if}{/each})
{/if}
