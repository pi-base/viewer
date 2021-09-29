import { writable } from 'svelte/store'

export function reducerStore<State, Action>(
  reducer: (state: State, action: Action) => State,
  initial: State
) {
  const store = writable(initial)

  function dispatch(action: Action) {
    store.update(($store) => reducer($store, action))
  }

  return {
    subscribe: store.subscribe,
    dispatch,
  }
}
