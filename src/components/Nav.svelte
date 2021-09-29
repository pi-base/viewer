<script lang="ts">
  import { Link } from 'svelte-routing'
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
    <span class="navbar-brand"><Link to="/">π-Base</Link></span><button
      aria-controls="navbar-nav"
      type="button"
      aria-label="Toggle navigation"
      class="navbar-toggler collapsed"
      ><span class="navbar-toggler-icon" /></button
    >
    <div class="navbar-collapse collapse" id="navbar-nav">
      <div class="navbar-nav">
        <Link class="nav-link" to="/spaces">Spaces</Link>
        <Link class="nav-link" to="/properties">Properties</Link>
        <Link class="nav-link" to="/theorems">Theorems</Link>
      </div>
      <div class="ml-auto navbar-nav">
        {#if showDevLink}<DevLink {branch} />{/if}
        <Link class="nav-link" to={paths.contributingGuide()}>Contribute</Link>
      </div>
    </div>
  </div>
</nav>
