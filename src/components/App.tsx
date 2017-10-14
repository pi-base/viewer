import * as React from 'react'
import { Router }   from 'react-router'
import { Provider, Store } from 'react-redux'

import { browserHistory } from 'react-router'

import * as T from '../types'

import { makeStore } from '../store'
import routes from '../routes'

import { ApolloProvider } from 'react-apollo'
import { Client, client } from '../graph'

interface Config {
  state?: T.StoreState
  client?: Client
}
export const wrap = (component, props: Config) => {
  const apollo = (props.client || client).apollo
  const store = makeStore(apollo, props.state)

  return () => (
    <ApolloProvider client={apollo}>
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
