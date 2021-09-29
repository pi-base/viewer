<script lang="ts">
  import { Space } from '../../models'
  import { Proof, default as S } from '../../models/Store'
  import Theorems from '../Theorems/SummaryList.svelte'
  import Traits from '../Spaces/TraitsForProperties.svelte'
  import { getStore } from '../../context'

  export let space: Space
  export let proof: Proof

  const store = getStore()

  $: theorems = proof.theorems.map((id: string) => S.theorem($store, id)!)
  $: properties = proof.properties.map((id: string) => S.property($store, id)!)
</script>

<p>Automatically deduced from the following</p>
<div class="row">
  <div class="col-6">
    <h5>Properties</h5>
    <Traits {space} {properties} />
  </div>
  <div class="col-6">
    <h5>Theorems</h5>
    <Theorems {theorems} />
  </div>
</div>
