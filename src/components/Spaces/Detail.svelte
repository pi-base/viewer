<script lang="ts">
  import { Space } from '../../models'
  import * as paths from '../../paths'
  import { References, Tab, Tabs, Tex, Title } from '../Shared'
  import Theorems from './Theorems.svelte'
  import Traits from './Traits.svelte'

  export let space: Space
  export let tab: 'theorems' | 'properties' | 'references' = 'theorems'
</script>

<Title {...space} />

<Tex body={space.description} />
<p />

<Tabs root={paths.space(space)} selected={tab} let:tabs>
  <Tab {tabs} path="theorems"><Theorems {space} /></Tab>
  <Tab {tabs} path="properties"><Traits {space} /></Tab>
  <Tab {tabs} path="references"><References refs={space.refs} /></Tab>
</Tabs>
