<script lang="ts">
  import { getStore } from '../../context'
  import { searchStore } from '../../stores/search'

  import Controls from './Search/Controls.svelte'
  import Results from './Search/Results.svelte'
  import Layout from './Search/Layout.svelte'

  const store = getStore()

  const { text, formula, query } = searchStore($store)
</script>

<Layout>
  <Controls slot="controls" {text} {formula} />
  <Results slot="results" {query} setSearch={formula.set} store={$store} />
</Layout>
