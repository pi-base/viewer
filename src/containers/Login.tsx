import * as React from 'react'
import { gql } from 'react-apollo'
import { Dispatch, connect } from 'react-redux'

import * as A from '../actions'
import * as Client from '../graph/client'
import * as T from '../types'

interface Props {
    login: (token: T.Token) => Promise<void>,
    params: {
        token: string
    }
}

class Login extends React.Component<Props, {}> {
    componentWillMount() {
        const { params: { token }, login } = this.props
        login(token).then(() => {
            console.log('login done')
        })
    }

    render() {
        return (<p>Logging in ...</p>)
    }
}

export default connect(
    () => ({}),
    (dispatch) => ({
        login: (token) => dispatch(A.login(token))
    })
)(Login)