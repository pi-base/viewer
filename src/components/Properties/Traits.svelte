<script lang="ts">
  import { Link } from 'svelte-routing'
  import type { Property, Space, Trait } from '../../models'
  import * as paths from '../../paths'
  import { traitsForProperty } from '../../models/Store'
  import { getStore } from '../../context'
  import { Check } from '../Icons'
  import { Filtered, Table, Tex } from '../Shared'
  import type { Weights } from '../../stores/filter'
  import Value from '../Traits/Value.svelte'

  export let property: Property

  const store = getStore()
  $: traits = Array.from(traitsForProperty($store, property).values())

  const weights: Weights<{ space: Space; trait: Trait }> = {
    // The weights generic type doesn't know how to handle
    // key nesting in the way that Fuse expects
    // @ts-expect-error
    'space.name': 0.7,
    'space.aliases': 0.5,
    'space.description': 0.2,
  }
</script>

<Filtered collection={traits} {weights} let:filtered>
  <Table collection={filtered} key={(t) => t.space.uid}>
    <tr slot="header">
      <th>Space</th>
      <th>Value</th>
      <th>Deduced</th>
    </tr>

    <tr slot="row" let:object={{ space, trait }}>
      <td>
        <Link to={paths.space(space)}>
          <Tex body={space.name} />
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
</Filtered>
