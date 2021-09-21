<script lang="ts">
  import Filter from '../Shared/Filter.svelte'
  import { Weights, filterStore } from '../../stores/filter'
  import { syncOnMount } from '../../stores/query'

  type Object = $$Generic

  export let collection: Object[]
  export let weights: Weights<Object>
  export let queryParam: string | null = 'filter'

  const { collection: filterCollection, filter, results } = filterStore(
    collection,
    weights
  )

  if (queryParam) {
    syncOnMount(queryParam, filter)
  }

  $: filterCollection.set(collection)
</script>

<Filter {filter} />
<slot filtered={$results} />
