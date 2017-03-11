import React from 'react'
import ReactDOM from 'react-dom'

import makeApp from './App'
import {store} from '../test'

const App = makeApp(store)

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render( < App / > , div)
})
