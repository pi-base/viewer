import * as React from 'react'
import './App.css'
import { ApolloProvider } from 'react-apollo'
import { getClient } from './client'

import Spaces from './Spaces'

const logo = require('./logo.svg')

const client = getClient()

class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.tsx</code> and save to reload.
          </p>
          <Spaces/>
        </div>
      </ApolloProvider>
    )
  }
}

export default App;
