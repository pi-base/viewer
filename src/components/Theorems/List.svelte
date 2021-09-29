<script lang="ts">
  import { Theorem } from '../../models'
  import { Filtered } from '../Shared'
  import SummaryList from './SummaryList.svelte'

  export let theorems: Theorem[]
</script>

<Filtered
  collection={theorems}
  weights={{
    when: 0.7,
    then: 0.7,
    description: 0.2,
  }}
  let:filtered
>
  <SummaryList theorems={filtered} withDescription={true} />
</Filtered>
