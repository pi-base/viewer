<script lang="ts">
  import { Dispatch, refresh } from '../../actions'
  import { Handler } from '../../errors'
  import { Store, status } from '../../models/Store'
  import { Spinner } from '../Icons'

  export let store: Store
  export let dispatch: Dispatch
  export let handler: Handler

  let branch = store.remote.branch
  let host = store.remote.host

  async function save() {
    return refresh({ branch, dispatch, host, store, handler })
  }

  $: fetching = status(store).state === 'fetching'
</script>

<table class="table">
  <tbody>
    <tr>
      <th>Host</th>
      <td>
        <input class="form-control" bind:value={host} on:blur={save} />
      </td>
    </tr>
    <tr>
      <th>Branch</th>
      <td>
        <input class="form-control" bind:value={branch} on:blur={save} />
      </td>
    </tr>
    <tr>
      <th>ETag</th>
      <td>
        <code>{store.etag}</code>
      </td>
    </tr>
    <tr>
      <th>Synced</th>
      <td>
        <!-- TODO: time ago in words -->
        {store.remote.fetched}
      </td>
    </tr>
    <tr>
      <td />
      <td>
        <button
          on:click={save}
          class="btn btn-outline-dark"
          disabled={fetching}
        >
          {#if fetching}<Spinner />{/if}
          Refresh
        </button>
      </td>
    </tr>
  </tbody>
</table>
