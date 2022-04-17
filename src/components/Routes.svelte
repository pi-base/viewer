<script lang="ts">
  import { Route } from 'svelte-routing'

  import Dev from './Dev/Dev.svelte'
  import Preview from './Dev/Preview.svelte'
  import Home from './Home.svelte'
  import NotFound from './Shared/NotFound.svelte'
  import Properties from './Properties/Properties.svelte'
  import Property from './Properties/Property.svelte'
  import Search from './Spaces/Search.svelte'
  import Space from './Spaces/Space.svelte'
  import Trait from './Traits/Trait.svelte'
  import Theorem from './Theorems/Theorem.svelte'
  import Theorems from './Theorems/Theorems.svelte'

  import type { Dispatch } from '../actions'
  import type { Handler } from '../errors'

  export let dispatch: Dispatch
  export let handler: Handler
</script>

<Route path="/spaces/:spaceId/properties/:propertyId" let:params>
  <Trait spaceId={params.spaceId} propertyId={params.propertyId} />
</Route>

<Route path="/spaces/:id/theorems" let:params>
  <Space id={params.id} tab="theorems" />
</Route>
<Route path="/spaces/:id/properties" let:params>
  <Space id={params.id} tab="properties" />
</Route>
<Route path="/spaces/:id/references" let:params>
  <Space id={params.id} tab="references" />
</Route>
<Route path="/spaces/:id" let:params>
  <Space id={params.id} />
</Route>
<Route path="/spaces" component={Search} />

<Route path="/properties/:id/theorems" let:params>
  <Property id={params.id} tab="theorems" />
</Route>
<Route path="/properties/:id/spaces" let:params>
  <Property id={params.id} tab="spaces" />
</Route>
<Route path="/properties/:id/references" let:params>
  <Property id={params.id} tab="references" />
</Route>
<Route path="/properties/:id" let:params>
  <Property id={params.id} />
</Route>
<Route path="/properties" component={Properties} />

<Route path="/theorems/:id/converse" let:params>
  <Theorem id={params.id} tab="converse" />
</Route>
<Route path="/theorems/:id/references" let:params>
  <Theorem id={params.id} tab="references" />
</Route>
<Route path="/theorems/:id" let:params>
  <Theorem id={params.id} />
</Route>
<Route path="/theorems" component={Theorems} />

<Route path="/dev/preview" component={Preview} />
<Route path="/dev" component={Dev} {dispatch} {handler} />
<Route path="/" component={Home} />

<Route path="*" component={NotFound} />
