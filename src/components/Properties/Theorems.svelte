<script lang="ts">
  import { Property } from '../../models'
  import { theoremsWithProperty } from '../../models/Store'
  import Theorems from '../Theorems/SummaryList.svelte'
  import { getStore } from '../Svelte'

  export let property: Property

  $: theorems = theoremsWithProperty(getStore(), property)
</script>

<Theorems {theorems} />
