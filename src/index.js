import 'babel-polyfill'

import React      from 'react'
import ReactDOM   from 'react-dom'
import {Router}   from 'react-router'
import {Provider} from 'react-redux'

import './index.css'

import { browserHistory } from 'react-router'

import {makeStore} from './store'
import routes      from './routes'


const store = makeStore()

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
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
