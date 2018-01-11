import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { login } from '../actions'

type RouteProps = RouteComponentProps<{ token: string }>
type StateProps = {
  login: (token: string) => void
}
type Props = RouteProps & StateProps

class Login extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.login(this.props.match.params.token)
  }

  render() {
    return (
      <div className="container">
        <h4>Logging in ...</h4>
      </div>
    )
  }
}

export default withApollo(connect(
  () => ({}),
  (dispatch, ownProps) => ({
    login: (token) => login(ownProps.client, dispatch, token)
  })
)(Login))
