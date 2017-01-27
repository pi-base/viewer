import 'babel-polyfill'

import React      from 'react'
import ReactDOM   from 'react-dom'
import Relay      from 'react-relay'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import {createHashHistory} from 'history' // TODO: wat?
import {applyRouterMiddleware, useRouterHistory} from 'react-router'
import useRelay from 'react-router-relay'

import { makeStore } from './store'
import routes from './routes/index'

const history = useRouterHistory(createHashHistory)()
const store = makeStore()

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3001/graphql')
)

ReactDOM.render(
  <Provider store={store}>
    <Router
      environment={Relay.Store}
      history={history}
      render={applyRouterMiddleware(useRelay)}>
        {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
)
