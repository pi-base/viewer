import React from 'react'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import { browserHistory } from 'react-router'

import {makeStore} from '../store'
import routes      from '../routes'

const makeApp = (store) => {
  store = store || makeStore()

  return () => (
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>
  )
}

export default makeApp
