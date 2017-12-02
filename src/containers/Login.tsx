import * as React from 'react'

import store from '../store'
import * as T from '../types'

class Login extends React.Component<T.RouterProps, {}> {
    componentWillMount() {
        store.login(this.props.params.token).then(() => {
            // TODO: track last path before login and redirect there
            this.props.router.push('/')
        })
    }

    render() {
        return (<p>Logging in ...</p>)
    }
}

export default Login