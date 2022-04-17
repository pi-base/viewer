<script lang="ts">
  import { Router } from 'svelte-routing'
  import { onMount, setContext } from 'svelte'

  import { boot, save } from './actions'
  import { status } from './models/Store'
  import { reducer, initial } from './reducers'
  import type { Handler } from './errors'
  import { onChange } from './stores/onChange'
  import { reducerStore } from './stores/reducer'
  import { debounce } from './util'

  import Nav from './components/Nav.svelte'
  import Routes from './components/Routes.svelte'
  import StatusBar from './components/StatusBar.svelte'

  export let handler: Handler

  const state = reducerStore(reducer, initial)

  setContext('dispatch', state.dispatch)
  setContext('handler', handler)
  setContext('store', { subscribe: state.subscribe })

  onMount(() => {
    boot(state.dispatch, handler)
    onChange(state, debounce(save))
  })
</script>

<Router>
  <Nav branch={$state.remote.branch} />
  <div class="container">
    <Routes dispatch={state.dispatch} {handler} />
  </div>
</Router>

<StatusBar status={status($state)} />
