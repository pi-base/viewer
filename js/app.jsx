import 'babel-polyfill'

import React    from 'react'
import ReactDOM from 'react-dom'
import Relay    from 'react-relay'
import {Router} from 'react-router'

import {createHashHistory} from 'history' // TODO: wat?
import {applyRouterMiddleware, useRouterHistory} from 'react-router'
import useRelay from 'react-router-relay'

import routes from './routes/index'

const history = useRouterHistory(createHashHistory)()

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:3001/graphql')
)

ReactDOM.render(
  <Router
    environment={Relay.Store}
    history={history}
    render={applyRouterMiddleware(useRelay)}>
      {routes}
  </Router>,
  document.getElementById('root')
)
