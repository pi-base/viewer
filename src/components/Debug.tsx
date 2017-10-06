import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router'

import * as A from '../actions'
import * as T from '../types'

export interface Props {
  state: T.StoreState
  refetch: () => void
}

class Debug extends React.Component<Props, undefined> {
  // tslint:disable no-any no-console
  logState() {
    (window as any).$s = this.props.state
    console.log('$s:', this.props.state)
  }

  error() {
    return ('' as any).floop('')
  }
  // tslint:enable no-any no-console

  render() {
    const version = (label: string, val?: string) => (
      <a href="#" title="{val}">{label} | {val ? val.slice(0, 7) : '??'}</a>
    )

    return (
      <nav className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container">
          <ul className="nav navbar-nav">
            <li><a href="#" onClick={() => this.logState()}>Log State</a></li>
            <li><a href="#" onClick={() => this.error()}>Error</a></li>
            <li><a href="#" onClick={() => this.props.refetch()}>Refetch</a></li>
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
  (state: T.StoreState) => { return { state } },
  (dispatch: Dispatch<A.FetchStart>) => ({
    refetch: () => { A.fetchUniverse(dispatch, undefined, true) }
  })
)(Debug)
