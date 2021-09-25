<script lang="ts">
  import { Theorem } from '../../models'
  import Formula from '../Shared/Formula.svelte'
  import Id from '../Shared/Id.svelte'
  import Table from '../Shared/Table.svelte'

  export let theorems: Theorem[]
</script>

<Table collection={theorems} key={(t) => t.uid}>
  <tr slot="header" let:sort>
    <th on:click={sort('uid')}>Id</th>
    <th>When</th>
    <th>Then</th>
  </tr>

  <tr slot="row" let:object={theorem}>
    <td><Id value={theorem.uid} /></td>
    <td><Formula value={theorem.when} /></td>
    <td><Formula value={theorem.then} /></td>
  </tr>
</Table>
