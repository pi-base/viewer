<script lang="ts">
  import type { Property, Space } from '../../models'
  import { traitsForSpace } from '../../models/Store'
  import { getStore } from '../../context'
  import List from './TraitSummary.svelte'

  export let space: Space
  export let properties: Property[]

  // TODO: better optimize the data model here
  const store = getStore()
  $: propertyIds = new Set(properties.map((p) => p.uid))
  $: traits = Array.from(traitsForSpace($store, space).values()).filter((t) =>
    propertyIds.has(t.property.uid)
  )
</script>

<List {space} {traits} />
