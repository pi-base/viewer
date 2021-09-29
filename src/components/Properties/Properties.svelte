<script lang="ts">
  import { default as S } from '../../models/Store'
  import { getStore } from '../../context'
  import List from './List.svelte'

  const store = getStore()
  $: properties = S.properties($store)
</script>

<List {properties} />
