import * as React from 'react'
import { Router }   from 'react-router'
import { Provider, Store } from 'react-redux'

import { browserHistory } from 'react-router'

import * as T from '../types'

import { makeStore } from '../store'
import routes from '../routes'

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { getClient } from '../graph'

interface Props {
  state?: T.StoreState
  client?: ApolloClient
}
export const wrap = (component, { state, client }: Props) => {
  const store = makeStore(client || getClient(), state)

  return () => (
    <ApolloProvider client={client!}>
      <Provider store={store}>
        <Router history={browserHistory}>
          {component}
        </Router>
      </Provider>
    </ApolloProvider>
  )
}

const makeApp = ({ state, client }) => wrap(routes, { state, client })

export default makeApp
