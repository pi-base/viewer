import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import Navbar from './Navbar'
import Debug  from './Debug'

import * as A from '../actions'
import * as T from '../types'

import { withViewer } from '../graph'

export interface Props {
  loaded: boolean
  location: {
    pathname: string
  }
  // tslint:disable-next-line no-any
  client: any
  fetchUniverse: () => void
  handleLogin: (token: string) => void
}

export interface State {
  debug: boolean
}

class Layout extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      debug: process.env.NODE_ENV === 'development'
    }
  }

  componentWillMount() {
    // Call _pi_base_debug in the console to show the debug toolbar in prod
    // tslint:disable-next-line no-any
    (window as any)._pi_base_debug = () => this.setState({debug: !this.state.debug})
  }

  render() {
    return (
      <div>
        <Navbar/>

        <div className="container">
          { this.props.loaded || this.props.location.pathname === '/'
          ? this.props.children
          : 'Loading...' }
        </div>

        { this.state.debug
        ? <Debug/>
        : ''}
      </div>
    );
  }
}

function mapStateToProps(state: T.StoreState) {
  return {
    loaded: true
  }
}

function mapDispatchToProps(dispatch: Dispatch<A.FetchStart>) {
  return {
    handleLogin: (token) => A.login(dispatch, token)
  }
}

export default withViewer(connect(mapStateToProps, mapDispatchToProps)(Layout))
