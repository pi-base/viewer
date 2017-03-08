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
    const version = (label, val) => {
      <a href="#" title="{val}">{label} | {val ? val.slice(0,7) : '??'}</a>
    }
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
            <li>{version('App', process.env.REACT_APP_GIT_VERSION)}</li>
            <li>{version('DB', process.env.REACT_APP_DB_VERSION)}}</li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default connect(
  (state) => { return { state } },
  (dispatch) => ({
    refetch: () => { A.fetchUniverse(dispatch, null, true) }
  })
)(Debug)
