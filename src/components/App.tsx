import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { Store } from 'redux'

import { Config } from './Config'
import Layout from './Layout'

import { Client } from '../graph'
import routes from '../routes'
import { State } from '../reducers'

const makeApp = ({ graph, store }: { graph: Client, store: Store<State> }) => () => (
  <ApolloProvider client={graph}>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          {routes}
        </Layout>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>
)

export default makeApp
