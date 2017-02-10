import React from 'react'
import Relay from 'react-relay'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import State  from './State'

import * as A from '../actions'

class App extends React.Component {
  componentWillMount() {
    if (this.props.viewer) {
      this.props.cacheUniverse(this.props.viewer)
    }
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className="container">
          {this.props.children}
        </div>
        {process.env.NODE_ENV === 'development'
        ? <div className="container">
            <hr/>
            <State/>
          </div>
        : ''
        }
      </div>
    );
  }
}

const AppU = connect(
  (state)    => ({}),
  (dispatch) => ({
    cacheUniverse: (u) => { dispatch(A.cacheUniverse(u)) }
  })
)(App)

export default Relay.createContainer(AppU, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        spaces {
          uid
          name
        }
        properties {
          uid
          name
        }
        traitTable
      }`
  }
})
