<script lang="ts">
  import { Property, Space, Trait } from '../../models'
  import paths from '../../paths'
  import { References, Tex } from '../Shared/index'
  import Proof from './Proof.svelte'

  export let property: Property
  export let space: Space
  export let trait: Trait
</script>

<h1>
  <a href={paths.space(space)}>
    <Tex body={space.name} />
  </a>
  {trait.value ? ' is ' : ' is not '}
  <a href={paths.property(property)}>
    <Tex body={property.name} />
  </a>
</h1>

{#if trait.proof}
  <Proof {space} proof={trait.proof} />
{:else}
  <Tex body={trait.description} />
  <h4>References</h4>
  <References refs={trait.refs} />
{/if}
