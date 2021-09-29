<script lang="ts">
  import { Property } from '../../models'
  import { Filtered, Id, Preview, Table, Tex } from '../Shared'

  export let properties: Property[]
</script>

<Filtered
  collection={properties}
  weights={{
    name: 0.7,
    aliases: 0.5,
    description: 0.2,
  }}
  let:filtered
>
  <Table collection={filtered} key={(t) => t.uid}>
    <tr slot="header" let:sort>
      <th on:click={sort('uid')}>Id</th>
      <th on:click={sort('name')}>Name</th>
      <th>Description</th>
    </tr>

    <tr slot="row" let:object={property}>
      <td><Id value={property.uid} /></td>
      <td><Tex body={property.name} /></td>
      <td><Preview body={property.description} /></td>
    </tr>
  </Table>
</Filtered>
