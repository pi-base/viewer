<script lang="ts">
  export let names: string[]
</script>

<small>
  <span class="text-muted">or</span>
  {#each names as name, index}
    {name}{#if index !== names.length - 1}<span class="text-muted"
        >,
      </span>{/if}
  {/each}
</small>
