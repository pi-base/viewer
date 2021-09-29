<script lang="ts">
  import { getContext } from 'svelte'
  import paths from '../../paths'
  import { getStore } from '../../context'
  import { Handler } from '../../errors'
  import { loaded } from '../../models/Store'

  const store = getStore()
  const handler: Handler = getContext('handler')

  let isLoaded = false

  // TODO: redirect /theorems/I# => /theorems/T#; report if used

  $: location = window.location

  $: {
    isLoaded = loaded($store)
    if (isLoaded) {
      handler.error(new Error('Not Found'), { location })
    }
  }

  const issueUrl =
    location &&
    paths.viewerIssues({
      title: `Could not find \`${location.pathname + location.search}\``,
      body:
        "If possible, add a description of how you got to this page, and what you'd expect to find here.",
    })
</script>

{#if isLoaded}
  <div class="jumbotron">
    <h1>404 Not Found</h1>
    <p>
      You appear to be looking for
      {' '}
      <code>{location.pathname}</code>, but no matching page was found.
    </p>
    <p>
      If this is a bug, please help out by <a href={issueUrl}>reporting it</a>.
    </p>
  </div>
{:else}
  <div role="status" class="spinner-border" />
   Loading ...
{/if}
