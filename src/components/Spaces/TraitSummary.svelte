<script lang="ts">
  import { Link } from 'svelte-routing'
  import type { Property, Space, Trait } from '../../models'
  import * as paths from '../../paths'
  import { getStore } from '../../context'
  import { Check } from '../Icons'
  import { Table, Tex } from '../Shared'
  import Value from '../Traits/Value.svelte'

  export let space: Space
  export let traits: { property: Property; trait: Trait }[]

  // TODO: move into Traits folder?
  const store = getStore()
</script>

<Table collection={traits} key={(t) => t.property.uid}>
  <tr slot="header">
    <th>Property</th>
    <th>Value</th>
    <th>Deduced</th>
  </tr>

  <tr slot="row" let:object={{ property, trait }}>
    <td>
      <Link to={paths.property(property)}>
        <Tex body={property.name} />
      </Link>
    </td>
    <td>
      <Link to={paths.trait(trait)}>
        <!-- TODO: don't need to refetch these -->
        <Value store={$store} {space} {property} />
      </Link>
    </td>
    <td>
      {#if trait.proof}
        <Check />
      {/if}
    </td>
  </tr>
</Table>
