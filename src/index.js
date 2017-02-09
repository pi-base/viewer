import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Relay      from 'react-relay'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import './index.css'

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

const store = makeStore()

// import CacheManager from 'relay-cache-manager'
// const cacheManager = new CacheManager()
// Relay.Store.getStoreData().injectCacheManager(cacheManager)

const network = new Relay.DefaultNetworkLayer('http://localhost:3001/graphql', {
  fetchTimeout: 5000,
  retryDelays: []
})

Relay.injectNetworkLayer({
  sendMutation(req) {
    network.sendMutation(req)
  },

  sendQueries(reqs) {
    network.sendQueries(reqs)
    reqs.forEach(r => console.log('Sending', r._printedQuery.text, r))
  },

  supports(...options) {
    network.supports(...options)
  }
})

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

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
