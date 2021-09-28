<script lang="ts">
  import { Space } from '../../models'
  import { Id, Preview, Table, Tex } from '../Shared'

  export let spaces: Space[]
</script>

<Table collection={spaces} key={(s) => s.uid}>
  <tr slot="header" let:sort>
    <th on:click={sort('uid')}>Id</th>
    <th on:click={sort('name')}>Name</th>
    <th>Description</th>
  </tr>

  <tr slot="row" let:object={space}>
    <td><Id value={space.uid} /></td>
    <td><Tex body={space.name} /></td>
    <td><Preview body={space.description} /></td>
  </tr>
</Table>
