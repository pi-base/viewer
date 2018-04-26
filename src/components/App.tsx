import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { Store } from 'redux'

import { Config } from './Config'
import Layout from './Layout'

import { Client } from '../graph'
import routes from '../routes'
import { State } from '../reducers'

import GraphExplorer from '../components/GraphExplorer'

const makeApp = ({ graph, store }: { graph: Client, store: Store<State> }) => () => {
  const layout = props => <Layout>{routes}</Layout>

  return (
    <ApolloProvider client={graph}>
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            {process.env.NODE_ENV === 'development'
              ? <Route path="/graph" exact={true} component={GraphExplorer(graph)} />
              : null
            }
            <Route component={layout} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  )
}

export default makeApp
