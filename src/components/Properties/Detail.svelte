<script lang="ts">
  import { Property } from '../../models'
  import * as paths from '../../paths'
  import { References, Tab, Tabs, Tex, Title } from '../Shared'
  import Theorems from './Theorems.svelte'
  import Traits from './Traits.svelte'

  export let property: Property
  export let tab: 'theorems' | 'spaces' | 'references' = 'theorems'
</script>

<Title {...property} />

<Tex body={property.description} />
<p />

<Tabs root={paths.property(property)} selected={tab} let:tabs>
  <Tab {tabs} path="theorems"><Theorems {property} /></Tab>
  <Tab {tabs} path="spaces"><Traits {property} /></Tab>
  <Tab {tabs} path="references"><References refs={property.refs} /></Tab>
</Tabs>
