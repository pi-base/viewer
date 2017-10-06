import * as React from 'react'
import * as ReactDOM from 'react-dom'

import makeApp from './App'

const App = makeApp()

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App/>, div)
})
