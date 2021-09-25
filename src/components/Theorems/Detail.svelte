<script lang="ts">
  import { Theorem } from '../../models'
  import { Tabs, Tab } from '../Shared/Tabs/index'
  import Formula from '../Shared/Formula.svelte'
  import Tex from '../Shared/Tex.svelte'
  import * as paths from '../../paths'
  import Converse from './Converse.svelte'
  import References from '../Shared/References.svelte'

  export let theorem: Theorem
  export let tab: 'converse' | 'references' = 'converse'
</script>

<h1>
  <Formula value={theorem.when} />
  ⇒
  <Formula value={theorem.then} />
</h1>

<Tex body={theorem.description} />
<p />

<Tabs root={paths.theorem(theorem)} selected={tab} let:tabs>
  <Tab {tabs} path="converse"><Converse {theorem} /></Tab>
  <Tab {tabs} path="references"><References refs={theorem.refs} /></Tab>
</Tabs>
