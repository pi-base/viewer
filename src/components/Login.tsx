import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { login } from '../actions'
import { Token } from '../types'

type RouteProps = RouteComponentProps<{ token: string }>
type StateProps = {
  login: (token: Token) => Promise<Token>
}
type Props = RouteProps & StateProps

class Login extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.login(this.props.match.params.token)
  }

  render() {
    return (<p>Logging in ...</p>)
  }
}

export default withRouter(withApollo(connect(
  () => ({}),
  (dispatch, ownProps) => ({
    login: (token: Token) => login(ownProps.client, dispatch, token).then(() => {
      const next = localStorage.getItem('piBase.returnTo') || '/'
      localStorage.removeItem('piBase.returnTo')
      ownProps.history.push(next)
    })
  })
)(Login)))