<script lang="ts">
  import { hardReset } from '../../actions'
  import type { Store } from '../../models/Store'

  export let store: Store
</script>

<table class="table">
  <tbody>
    <tr>
      <th>Checked</th>
      <td data-test-id="store-checked-size">{store.checked.size}</td>
    </tr>
    <tr>
      <th>Traits</th>
      <td>{store.bundle.traits.size}</td>
    </tr>
    <tr>
      <td />
      <td>
        <button
          on:click={() => console.log(store)}
          class="btn btn-outline-dark"
        >
          Log Store
        </button>
        <button on:click={hardReset} class="btn btn-outline-danger">
          Reset
        </button>
      </td>
    </tr>
  </tbody>
</table>
