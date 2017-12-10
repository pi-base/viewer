import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { Store } from 'redux'

import Layout from './Layout'
import routes from '../routes'
import { State } from '../reducers'

type AppConfig = {
  apollo: ApolloClient<{}>
  store: Store<State>
}
const makeApp = ({ apollo, store }: AppConfig) => () => (
  <ApolloProvider client={apollo}>
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
