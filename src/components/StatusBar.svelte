<script lang="ts">
  import { hardReset } from '../actions'
  import { viewerIssues } from '../paths'
  import type { Status } from '../models/Store'
  import { ProgressBar, Notice } from './Layout'

  export let status: Status

  function issueLink(error: string | null) {
    return viewerIssues({
      title: error ?? 'Viewer failing to load',
      body:
        'If possible, add any extra information that could help to troubleshoot the issue.',
    })
  }
</script>

{#if status.state === 'checking'}
  <Notice title="Checking Theorems">
    <ProgressBar now={status.complete + 1} max={status.total} />
  </Notice>
{:else if status.state === 'error'}
  <Notice title="Failed to Load">
    <p>An error has prevented the viewer from loading.</p>
    {#if status.message}
      <p><code>{status.message}</code></p>
    {/if}
    <p>
      If this error persists, you can help by <a
        href={issueLink(status.message)}>reporting it</a
      >.
    </p>
    <button on:click={hardReset} class="btn btn-outline-danger">Reset</button>
  </Notice>
{/if}
