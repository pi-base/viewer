import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Dispatch } from 'redux'

import { Action, boot } from '../actions'
import { State } from '../reducers'

import BranchSelect from './Form/BranchSelect'
import Navbar from './Navbar'

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

        <div className="container">
          <BranchSelect />
          {this.props.booted || this.props.location.pathname === '/'
            ? this.props.children
            : 'Loading...'}
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