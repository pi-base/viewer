<script lang="ts">
  import { Link } from 'svelte-routing'
  import { MAIN_BRANCH } from '../../models/Store'

  export let branch: string
</script>

<Link class="nav-link" to="/dev">
  {#if branch === MAIN_BRANCH}
    Dev
  {:else}
    <!-- TODO: branch icon -->
    {branch}
  {/if}
</Link>
