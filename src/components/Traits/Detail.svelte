<script lang="ts">
  import { Link } from 'svelte-routing'
  import { Property, Space, Trait } from '../../models'
  import paths from '../../paths'
  import { References, Tex } from '../Shared'
  import Proof from './Proof.svelte'

  export let property: Property
  export let space: Space
  export let trait: Trait
</script>

<h1>
  <Link to={paths.space(space)}>
    <Tex body={space.name} />
  </Link>
  {trait.value ? 'is' : 'is not'}
  <Link to={paths.property(property)}>
    <Tex body={property.name} />
  </Link>
</h1>

{#if trait.proof}
  <Proof {space} proof={trait.proof} />
{:else}
  <Tex body={trait.description} />
  <p />
  <h4>References</h4>
  <References refs={trait.refs} />
{/if}
