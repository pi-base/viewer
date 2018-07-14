import * as React from 'react'

import { RouteComponentProps, withRouter } from 'react-router'

import Footer from './Footer'
import Navbar from './Navbar'
import { State } from '../reducers'
import { connect } from 'react-redux'

interface StateProps {
  booted: boolean
  debug: boolean
}
type Props = StateProps & RouteComponentProps<{}>

class Layout extends React.PureComponent<Props> {
  render() {
    const { booted, debug, location } = this.props

    return (
      <div>
        <Navbar />

        <div className="container">
          {booted || location.pathname === '/'
            ? this.props.children
            : 'Loading...'}
        </div>

        {debug ? <Footer /> : ''}
      </div>
    )
  }
}

// `withRouter` is required so that location changes will trigger a re-render
// see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect<StateProps, {}, {}, State>(
  state => ({
    booted: state.spaces.size > 0,
    debug: state.debug
  })
)(Layout))
