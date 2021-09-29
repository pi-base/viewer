<script lang="ts">
  import { Link } from 'svelte-routing'
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
    <Link
      to={`${root}/${key}`}
      class={`nav-item nav-link ${key === tabs.active ? 'active' : ''}`}
    >
      {title}
    </Link>
  {/each}
</nav>

<div class="tab-content">
  <slot {tabs} />
</div>
