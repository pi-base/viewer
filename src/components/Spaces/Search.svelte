<script lang="ts">
  import { getStore } from '../Svelte'
  import { syncOnMount } from '../../stores/query'
  import { searchStore } from '../../stores/search'

  import Controls from './Search/Controls.svelte'
  import Results from './Search/Results.svelte'
  import Layout from './Search/Layout.svelte'

  const store = getStore()

  const { text, formula, query } = searchStore(store)

  syncOnMount('formula', formula)
  syncOnMount('text', text)
</script>

<Layout>
  <Controls slot="controls" {text} {formula} />
  <Results slot="results" {query} setSearch={formula.set} {store} />
</Layout>
