<script lang="ts">
  import { Field, TableStore, tableStore } from '../../stores/table'

  type Object = $$Generic

  export let collection: Object[]
  export let key: (object: Object) => any

  let store: TableStore<Object>
  $: store = tableStore({ collection })

  const sort = (field: Field<Object>) => () => store.sort(field)
</script>

<table class="table">
  <thead>
    <slot name="header" {sort} />
  </thead>
  <tbody>
    {#each $store as object (key(object))}
      <slot name="row" {object} />
    {/each}
  </tbody>
</table>
