<script lang="ts">
  import { Property, Space } from '../../models'
  import { default as S, Store } from '../../models/Store'
  import * as Icons from '../Icons'
  import * as paths from '../../paths'

  export let store: Store
  export let property: Property
  export let space: Space

  let value: boolean | undefined = undefined

  $: {
    const trait = S.trait(store, { space: space.uid, property: property.uid })
    value = trait ? trait.value : undefined
  }
</script>

<a href={paths.trait({ space: space.uid, property: property.uid })}>
  {#if value === false}
    <Icons.X />
  {:else if value === undefined}
    <Icons.Question />
  {:else}
    <Icons.Check />
  {/if}
</a>
