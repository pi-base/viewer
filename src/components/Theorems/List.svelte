<script lang="ts">
  import { Theorem } from '../../models'
  import Formula from '../Shared/Formula.svelte'
  import Id from '../Shared/Id.svelte'
  import Table from '../Shared/Table.svelte'
  import Filtered from '../Shared/Filtered.svelte'
  import Preview from '../Shared/Preview.svelte'

  export let theorems: Theorem[]
</script>

<Filtered
  collection={theorems}
  weights={{
    when: 0.7,
    then: 0.7,
    description: 0.2,
  }}
  let:filtered
>
  <Table collection={filtered} key={(t) => t.uid}>
    <tr slot="header" let:sort>
      <th on:click={sort('uid')}>Id</th>
      <th>When</th>
      <th>Then</th>
      <th>Description</th>
    </tr>

    <tr slot="row" let:object={theorem}>
      <td><Id value={theorem.uid} /></td>
      <td><Formula value={theorem.when} /></td>
      <td><Formula value={theorem.then} /></td>
      <td><Preview body={theorem.description} /></td>
    </tr>
  </Table>
</Filtered>
