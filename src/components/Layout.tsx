import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { Action, boot } from '../actions'
import { State } from '../reducers'

import '../img/github-mark-32.png'

import Navbar from './Navbar'
import Footer from './Footer'

const GithubMark = require('../img/github-mark-32.png')

interface StateProps {
  booted: boolean
  location: { pathname: string }
}
interface DispatchProps {
  boot: () => void
}

class Layout extends React.PureComponent<StateProps & DispatchProps> {
  componentWillMount() {
    if (!this.props.booted) { this.props.boot() }
  }

  render() {
    return (
      <div>
        <Navbar />
        {this.props.booted || this.props.location.pathname === '/'
          ? this.props.children
          :
          <div className="container">
            <h4>Loading...</h4>
          </div>
        }
        <div className="container">
          <Footer />
          <p className="text-center">
            <a href="http://github.com/pi-base">
              <img src={GithubMark} />
            </a>
          </p>
          <p className="text-center">
            <a href="http://github.com/pi-base/data">Data</a>{' '}
            <a href="http://github.com/pi-base/viewer">Viewer</a>
          </p>
        </div>
      </div>
    )
  }
}

// `withRouter` is required so that location changes will trigger a re-render
// see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(withApollo(connect<{}, StateProps, DispatchProps>(
  (state: State) => ({
    booted: state.spaces.size > 0
  }),
  (dispatch: Dispatch<Action>, ownProps) => ({
    boot: () => boot(ownProps.client, dispatch)
  })
)(Layout)))