<script lang="ts">
  import { Property, Space, Trait } from '../../models'
  import * as paths from '../../paths'
  import { getStore } from '../Svelte'
  import { Check } from '../Icons'
  import { Table, Tex } from '../Shared/index'
  import Value from '../Traits/Value.svelte'

  export let space: Space
  export let traits: { property: Property; trait: Trait }[]

  // TODO: move into Traits folder?
  $: store = getStore()
</script>

<Table collection={traits} key={(t) => t.property.uid}>
  <tr slot="header" let:sort>
    <th>Property</th>
    <th>Value</th>
    <th>Deduced</th>
  </tr>

  <tr slot="row" let:object={{ property, trait }}>
    <td>
      <a href={paths.property(property)}>
        <Tex body={property.name} />
      </a>
    </td>
    <td>
      <a href={paths.trait(trait)}>
        <!-- TODO: don't need to refetch these -->
        <Value {store} {space} {property} />
      </a>
    </td>
    <td>
      {#if trait.proof}
        <Check />
      {/if}
    </td>
  </tr>
</Table>
