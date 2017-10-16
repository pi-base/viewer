import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider, Store } from 'react-redux'
import { Router, browserHistory } from 'react-router'

import debug from '../debug'
import { Client, client } from '../graph'
import routes from '../routes'
import { makeStore } from '../store'
import * as T from '../types'

interface Config {
  state?: T.StoreState
  client?: Client
}

export const wrap = (component, config: Config) => {
  const store = makeStore(config.client || client, config.state)

  debug(store)

  return () => (
    <ApolloProvider client={client.apollo}>
      <Provider store={store}>
        <Router history={browserHistory}>
          {component}
        </Router>
      </Provider>
    </ApolloProvider>
  )
}

const makeApp = (config) => wrap(routes, config)

export default makeApp
