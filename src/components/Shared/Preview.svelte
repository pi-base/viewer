<script lang="ts">
  import { onMount } from 'svelte'
  import { render as renderer } from './render-utils'

  export let body: string

  let container: HTMLElement

  async function render(text: string) {
    if (container) {
      container.innerHTML = await renderer(text, true)
    }
  }

  // TODO: unify w/ Tex.svelte HOC
  onMount(() => render(body))

  $: render(body)
</script>

<span bind:this={container} />
