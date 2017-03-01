import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'

// import JSONTree from 'react-json-tree'
import * as A from '../actions'

class Debug extends React.Component {
  logState() {
    window.$s = this.props.state
    console.log('$s:', this.props.state.toJS())
  }

  error() {
    return ''.floop('')
  }
  
  render() {
    const { state } = this.props

    return (
      <nav className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container">
          <ul className="nav navbar-nav">
            <li><a href="#" onClick={this.logState.bind(this)}>Log State</a></li>
            <li><a href="#" onClick={this.error.bind(this)}>Error</a></li>
            <li><a href="#" onClick={this.props.refetch}>Refetch</a></li>
            <li><Link to="/invalid/path">404</Link></li>
          </ul>
          <ul className="nav navbar-nav pull-right">
            <li><a href="#">App {state.getIn(['version', 'app'])}</a></li>
            <li><a href="#">DB {state.getIn(['version', 'db'])}</a></li>
            <li><a href="#">Data {state.getIn(['version', 'data'])}</a></li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default connect(
  (state) => { return { state } },
  (dispatch) => ({
    refetch: () => { A.fetchUniverse(dispatch, true) }
  })
)(Debug)
