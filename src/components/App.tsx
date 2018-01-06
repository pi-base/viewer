import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { Store } from 'redux'

import { Config } from './Config'
import Layout from './Layout'

import routes from '../routes'
import { State } from '../reducers'
import { Config as AppConfig } from '../types'

const makeApp = (config: AppConfig) => () => (
  <Config config={config}>
    <ApolloProvider client={config.graph}>
      <Provider store={config.store}>
        <BrowserRouter>
          <Layout>
            {routes}
          </Layout>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </Config>
)

export default makeApp
