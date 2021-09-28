import React, { useRef, useReducer } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'

import './App.css'

import { boot, save } from './actions'
import * as Error from './errors'
import { useChange } from './hooks'
import { Dispatch, Reducer, reducer, initial } from './reducers'
import { Provider, status } from './models/Store'
import Nav from './components/Nav.svelte'
import Main from './components/Main'
import StatusBar from './components/StatusBar'
import { debounce } from './util'
import { Svelte } from './components/Svelte'

const debouncedSave = debounce(save)

export default function App({
  errorHandler = Error.log(),
  startup = boot,
}: {
  errorHandler?: Error.Handler
  startup?: (dispatch: Dispatch, errorHandler: Error.Handler) => Promise<void>
}) {
  const [store, dispatch] = useReducer<Reducer>(reducer, initial)

  useChange(store, debouncedSave)

  const booted = useRef(false)
  if (!booted.current) {
    booted.current = true
    startup(dispatch, errorHandler)
  }

  return (
    <Error.Provider value={errorHandler}>
      <Router>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Provider value={store}>
            <StatusBar status={status(store)} />
            <Svelte component={Nav} props={{ branch: store.remote.branch }} />
            <Main dispatch={dispatch} handler={errorHandler} />
          </Provider>
        </QueryParamProvider>
      </Router>
    </Error.Provider>
  )
}
