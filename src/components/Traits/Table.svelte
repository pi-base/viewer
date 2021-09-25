<script lang="ts">
  import { Property, Space } from '../../models'
  import { getStore } from '../Svelte'
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
          <a href={paths.property(property)}>
            <Tex body={property.name} />
          </a>
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each spaces as space (space.uid)}
      <tr>
        <td>
          <a href={paths.space(space)}>
            <Tex body={space.name} />
          </a>
        </td>
        {#each properties as property (property.uid)}
          <td>
            <Value {store} {space} {property} />
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
