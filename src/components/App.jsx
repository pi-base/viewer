import React from 'react'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import { browserHistory } from 'react-router'

import {makeStore} from '../store'
import routes      from '../routes'

const store = makeStore()

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
      </Provider>
    )
  }
}

export default App
