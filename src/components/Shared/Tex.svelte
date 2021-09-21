<script lang="ts">
  import { onMount } from 'svelte'
  import { render as renderer, fullParser } from './render-utils'

  export let body: string

  let container: HTMLElement

  onMount(async () => {
    const rendered = await renderer(fullParser, body)
    if (container) {
      container.innerHTML = rendered.innerHTML
    }
  })
</script>

<span bind:this={container} />
