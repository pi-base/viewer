import * as React from 'react'
import { Router }   from 'react-router'
import { Provider, Store } from 'react-redux'

import { browserHistory } from 'react-router'

import * as T from '../types'

import {makeStore} from '../store'
import routes      from '../routes'

import { ApolloProvider } from 'react-apollo'
import { getClient } from '../graph'

const makeApp = (store?: Store<T.StoreState>) => {
  const client = getClient()
  store = store || makeStore(client)

  return () => (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
    </ApolloProvider>
  )
}

export default makeApp
