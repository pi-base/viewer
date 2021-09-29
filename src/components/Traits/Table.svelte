<script lang="ts">
  import { Link } from 'svelte-routing'
  import { Property, Space } from '../../models'
  import { getStore } from '../../context'
  import Tex from '../Shared/Tex.svelte'
  import Value from './Value.svelte'
  import * as paths from '../../paths'

  export let properties: Property[]
  export let spaces: Space[]

  const store = getStore()
</script>

<table class="table">
  <thead>
    <tr>
      <th />
      {#each properties as property (property.uid)}
        <th>
          <Link to={paths.property(property)}>
            <Tex body={property.name} />
          </Link>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each spaces as space (space.uid)}
      <tr>
        <td>
          <Link to={paths.space(space)}>
            <Tex body={space.name} />
          </Link>
        </td>
        {#each properties as property (property.uid)}
          <td>
            <Value store={$store} {space} {property} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
