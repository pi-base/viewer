<script lang="ts">
  import type { Property, Space, Trait } from '../../models'
  import { traitsForSpace } from '../../models/Store'
  import { getStore } from '../../context'
  import { Filtered } from '../Shared'
  import type { Weights } from '../../stores/filter'
  import List from './TraitSummary.svelte'

  export let space: Space

  const store = getStore()
  $: traits = Array.from(traitsForSpace($store, space).values())

  const weights: Weights<{ property: Property; trait: Trait }> = {
    // The weights generic type doesn't know how to handle
    // key nesting in the way that Fuse expects
    // @ts-expect-error
    'property.name': 0.7,
    'property.aliases': 0.5,
    'property.description': 0.2,
  }
</script>

<Filtered collection={traits} {weights} let:filtered>
  <List {space} traits={filtered} />
</Filtered>
