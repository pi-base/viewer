import * as React from 'react'

import { ConfigProps, withConfig } from './Config'
import { Dispatch, Token } from '../types'

import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import { login } from '../actions'

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
  (dispatch: Dispatch, ownProps: RouteProps): DispatchProps => ({
    login: (token: Token) => {
      return dispatch(login(token)).then(user => {
        const next = localStorage.getItem('piBase.returnTo') || '/'
        localStorage.removeItem('piBase.returnTo')
        ownProps.history.push(next)
        return token
      })
    }
  })
)(Login))