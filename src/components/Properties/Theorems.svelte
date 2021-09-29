<script lang="ts">
  import { Property } from '../../models'
  import { theoremsWithProperty } from '../../models/Store'
  import Theorems from '../Theorems/SummaryList.svelte'
  import { getStore } from '../../context'

  export let property: Property

  const store = getStore()
  $: theorems = theoremsWithProperty($store, property)
</script>

<Theorems {theorems} />
