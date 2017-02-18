import React from 'react'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import Debug  from './Debug'

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
        ? <Debug/>
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
