import React from 'react'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import Debug  from './Debug'

import * as A from '../actions'

class Layout extends React.Component {
  componentWillMount() {
    this.props.fetchUniverse()
  }

  render() {
    return (
      <div>
        <Navbar/>

        <div className="container">
          { this.props.loaded || this.props.location.pathname === '/'
          ? this.props.children
          : 'Loading...' }
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
  (state)    => ({ loaded: state.get('spaces').size > 0 }),
  (dispatch) => ({
    fetchUniverse: () => { A.fetchUniverse(dispatch) }
  })
)(Layout)
