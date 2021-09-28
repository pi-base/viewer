<script lang="ts">
  import { captureException } from '@sentry/browser'

  class DebugError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'DebugError'
    }
  }

  function debugError() {
    captureException(
      new DebugError('Intentionally triggered error to test Sentry integration')
    )
  }
</script>

<table class="table">
  <tbody>
    <tr>
      <td />
      <td>
        <button
          type="button"
          class="btn btn-outline-danger"
          on:click={debugError}
        >
          Trigger Error
        </button>
      </td>
    </tr>
  </tbody>
</table>
