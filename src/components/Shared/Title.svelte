<script lang="ts">
  import Aliases from './Aliases.svelte'
  import Tex from './Tex.svelte'

  export let name: string
  export let aliases: string[] | undefined = undefined
</script>

<h1>
  <Tex body={name} />
  {#if aliases && aliases.length > 0}
    <Aliases names={aliases} />
  {/if}
</h1>
