import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Router, browserHistory } from 'react-router'

import Debug from '../debug'
import { Client, client } from '../graph'
import routes from '../routes'
import store from '../store'
import * as T from '../types'

export const wrap = (component, graph?: Client) => {
  if (graph) {
    store.apollo = graph.apollo
  }

  return () => (
    <div>
      <ApolloProvider client={store.apollo}>
        <Router history={browserHistory}>
          {component}
        </Router>
      </ApolloProvider>
      <Debug store={store} />
    </div>
  )
}

const makeApp = (c) => wrap(routes, c)

export default makeApp
