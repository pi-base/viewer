import React from 'react'
import { connect } from 'react-redux'

import Navbar from './Navbar'
import Debug  from './Debug'

import * as A from '../actions'

class Layout extends React.Component {
  constructor() {
    super()
    this.state = {
      debug: process.env.NODE_ENV === 'development'
    }
  }

  componentWillMount() {
    this.props.fetchUniverse()
    window._pi_base_debug = () => this.setState({debug: !this.state.debug})
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

        { this.state.debug
        ? <Debug/>
        : ''}
      </div>
    );
  }
}

export default connect(
  (state)    => ({ loaded: state.get('spaces').size > 0 }),
  (dispatch) => ({
    fetchUniverse: () => { A.fetchUniverse(dispatch, process.env.DB_VERSION) }
  })
)(Layout)
