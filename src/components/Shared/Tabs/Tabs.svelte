<script lang="ts">
  import { onMount } from 'svelte'
  import { tabStore } from '../../../stores/tabs'

  export let selected: string
  export let root = '/'
  let registered: Record<string, string> = {}

  const tabs = tabStore(selected)

  onMount(() => {
    registered = tabs.tabs
  })
</script>

<nav class="nav nav-tabs">
  {#each Object.entries(registered) as [key, title]}
    <a
      href={`${root}/${key}`}
      class="nav-item nav-link"
      class:active={key === tabs.active}>{title}</a
    >
  {/each}
</nav>

<div class="tab-content">
  <slot {tabs} />
</div>
