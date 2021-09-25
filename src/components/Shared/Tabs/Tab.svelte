<script lang="ts">
  import { TabStore } from '../../../stores/tabs'

  export let tabs: TabStore<string>
  export let path: string
  export let title: string | undefined = undefined

  const active = tabs.register(path, title)
</script>

{#if active}
  <slot />
{/if}
