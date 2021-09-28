<script lang="ts">
  import paths from '../paths'
  import { MAIN_BRANCH } from '../models/Store'
  import DevLink from './Nav/DevLink.svelte'

  export let branch: string

  $: showDevLink =
    process.env.NODE_ENV === 'development' ||
    window.location.host.includes('dev.') ||
    window.location.host.includes('development.') ||
    branch !== MAIN_BRANCH

  $: bg = branch === MAIN_BRANCH ? 'light' : 'dark'
</script>

<nav class={`navbar navbar-expand navbar-${bg} bg-${bg}`}>
  <div class="container">
    <span class="navbar-brand"><a href="/">π-Base</a></span><button
      aria-controls="navbar-nav"
      type="button"
      aria-label="Toggle navigation"
      class="navbar-toggler collapsed"
      ><span class="navbar-toggler-icon" /></button
    >
    <div class="navbar-collapse collapse" id="navbar-nav">
      <div class="navbar-nav">
        <a class="nav-link" href="/spaces">Spaces</a>
        <a class="nav-link" href="/properties">Properties</a>
        <a class="nav-link" href="/theorems">Theorems</a>
      </div>
      <div class="ml-auto navbar-nav">
        {#if showDevLink}<DevLink {branch} />{/if}
        <a class="nav-link" href={paths.contributingGuide()}>Contribute</a>
      </div>
    </div>
  </div>
</nav>
