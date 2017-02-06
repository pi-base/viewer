import 'babel-polyfill'

import React      from 'react'
import Relay      from 'react-relay'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import {createMemoryHistory, createHashHistory} from 'history'
import {applyRouterMiddleware, useRouterHistory} from 'react-router'
import useRelay from 'react-router-relay'

import { makeStore } from './store'
import routes from './routes/index'

// TODO: fix up JSDOM, use hash history throughout
let history
try {
  history = useRouterHistory(createHashHistory)()
} catch(e) {
  history = useRouterHistory(createMemoryHistory)()
}

const store   = makeStore()

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3001/graphql')
)

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router
          environment={Relay.Store}
          history={history}
          render={applyRouterMiddleware(useRelay)}>
            {routes}
        </Router>
      </Provider>
    );
  }
}

export default App
