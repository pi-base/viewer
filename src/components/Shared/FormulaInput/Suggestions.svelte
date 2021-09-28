<script lang="ts">
  import { Tex } from '../../Shared'

  export let apply: (index: number) => void
  export let selected: number | null = null
  export let suggestions: string[]
</script>

{#if suggestions.length > 0}
  <div class="suggestions list-group">
    {#each suggestions as suggestion, index (suggestion)}
      <button
        class="list-group-item list-group-item-action"
        class:active={index === selected}
        on:click={() => apply(index)}
      >
        <Tex body={suggestion} />
      </button>
    {/each}
  </div>
{/if}
