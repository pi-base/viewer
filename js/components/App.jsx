import React from 'react'
import { connect } from 'react-redux'

import { fetchCache } from '../actions'
import State from './state'

class App extends React.Component {
  componentDidMount() {
    this.props.fetchCache()
  }

  render() {
    return (
      <div>
        {this.props.children}

        <State/>
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