import * as React from 'react'

import { Route, Switch } from 'react-router'

import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'
import { Client } from '../graph'
import GraphExplorer from '../components/GraphExplorer'
import Layout from './Layout'
import { Provider } from 'react-redux'
import { State } from '../reducers'
import { Store } from 'redux'
import routes from '../routes'

const makeApp = ({ graph, store }: { graph: Client, store: Store<State> }) => () => {
  const layout = _ => <Layout>{routes}</Layout>

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
