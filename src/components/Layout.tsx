import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { Action, boot } from '../actions'
import { State } from '../reducers'

import Navbar from './Navbar'
import Footer from './Footer'

interface StateProps {
  booted: boolean
  location: { pathname: string }
}

class Layout extends React.PureComponent<StateProps> {
  render() {
    return (
      <div>
        <Navbar />
        {
          this.props.booted || this.props.location.pathname === '/'
          ?
          this.props.children
          :
          <div className="container">Loading...</div>
        }
        <Footer />
      </div>
    )
  }
}

// `withRouter` is required so that location changes will trigger a re-render
// see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect<{}, StateProps>(
  (state: State) => ({
    booted: state.spaces.size > 0
  })
)(Layout))
