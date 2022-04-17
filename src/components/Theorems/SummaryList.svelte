<script lang="ts">
  import type { Theorem } from '../../models'
  import { Formula, Id, Preview, Table } from '../Shared'

  export let theorems: Theorem[]
  export let withDescription: boolean = false
</script>

<Table collection={theorems} key={(t) => t.uid}>
  <tr slot="header" let:sort>
    <th on:click={sort('uid')}>Id</th>
    <th>When</th>
    <th>Then</th>
    {#if withDescription}
      <th>Description</th>
    {/if}
  </tr>

  <tr slot="row" let:object={theorem}>
    <td><Id value={theorem.uid} /></td>
    <td><Formula value={theorem.when} /></td>
    <td><Formula value={theorem.then} /></td>
    {#if withDescription}
      <td><Preview body={theorem.description} /></td>
    {/if}
  </tr>
</Table>
