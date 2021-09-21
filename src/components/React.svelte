<script>
  // This is a shim to allow calling React components from within Svelte
  // It is not production-good - e.g. it does not handle passing context
  //   required for routing or store lookups.
  // This should probably only be used during development iterations, and
  //   and deleted once the port to Svelte is complete (TODO)
  import { onMount, onDestroy } from 'svelte'
  import React from 'react'
  import ReactDOM from 'react-dom'

  export let component
  export let props

  let el
  let container

  onMount(() => {
    el = React.createElement(component, props)
    ReactDOM.render(el, container)
  })

  onDestroy(() => {
    ReactDOM.unmountComponentAtNode(container)
  })
</script>

<div bind:this={container} />
