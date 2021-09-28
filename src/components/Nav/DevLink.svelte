<script lang="ts">
  import { MAIN_BRANCH } from '../../models/Store'

  export let branch: string
</script>

<a class="nav-link" href="/dev">
  {#if branch === MAIN_BRANCH}
    Dev
  {:else}
    <!-- TODO: branch icon -->
    {branch}
  {/if}
</a>
