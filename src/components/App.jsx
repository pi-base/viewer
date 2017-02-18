import React from 'react'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import State  from './State'

import * as A from '../actions'

class App extends React.Component {
  componentWillMount() {
    this.props.fetchUniverse()
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

export default connect(
  (state)    => ({}),
  (dispatch) => ({
    fetchUniverse: () => { dispatch(A.fetchUniverse) }
  })
)(App)
