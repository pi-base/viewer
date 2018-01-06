import * as React from 'react'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'

import { ConfigProps, withConfig } from './Config'

import { login } from '../actions'
import { Token } from '../types'

type RouteProps = RouteComponentProps<{ token: string }>
type DispatchProps = {
  login: (token: Token) => Promise<Token>
}
type Props = RouteProps & DispatchProps & ConfigProps

class Login extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.login(this.props.match.params.token)
  }

  render() {
    return (<p>Logging in ...</p>)
  }
}

export default withConfig(connect(
  () => ({}),
  (dispatch, ownProps): DispatchProps => ({
    login: (token: Token) => {
      return login(ownProps.config.graph, dispatch, token).then(t => {
        ownProps.config.setToken(t)
        const next = localStorage.getItem('piBase.returnTo') || '/'
        localStorage.removeItem('piBase.returnTo')
        ownProps.history.push(next)
        return t
      })
    }
  })
)(Login))