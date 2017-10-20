import * as React from 'react'
import { gql } from 'react-apollo'
import { Dispatch, connect } from 'react-redux'

import * as Client from '../graph/client'
import * as T from '../types'

interface Props {
    login: (token: T.Token) => Promise<void>,
    params: {
        token: string
    }
}

class Login extends React.Component<Props & T.RouterProps, {}> {
    componentWillMount() {
        const { params: { token }, login } = this.props
        login(token).then(() => {
            // TODO: track last path before login and redirect there
            this.props.router.push('/')
        })
    }

    render() {
        return (<p>Logging in ...</p>)
    }
}

export default connect(
    () => ({}),
)(Login)