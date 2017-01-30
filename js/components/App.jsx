import React from 'react'
import { connect } from 'react-redux'

import { fetchCache } from '../actions'
import State from './state'

import Navbar from './navbar'

class App extends React.Component {
  componentDidMount() {
    this.props.fetchCache()
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className="container">
          {this.props.children}
        </div>
        <hr/>
        <div className="container">
          <State/>
        </div>
      </div>
    );
  }
}

export default connect(
    (state)    => ({}),
    (dispatch) => ({
        fetchCache: () => { dispatch(fetchCache()) }
    })
)(App)
