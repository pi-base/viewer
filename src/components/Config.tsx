import * as React from 'react'
import PropTypes from 'prop-types'
import { Store } from 'redux'

import { Client } from '../graph'
import { Config as AppConfig } from '../types'

export interface ConfigProps {
  config: AppConfig
}

export const withConfig = Component => {
  const name = Component.displayName || Component.name || 'Component'

  class WithConfig extends React.Component {
    static displayName = `WithConfig(${name})`

    static contextTypes = {
      config: PropTypes.object
    }

    render() {
      return <Component {...this.props} config={this.context.config} />
    }
  }

  return WithConfig
}

export class Config extends React.Component<ConfigProps> {
  constructor(props: ConfigProps) {
    super(props)
  }

  getChildContext(): ConfigProps {
    return { config: this.props.config }
  }

  render() {
    return this.props.children
  }
}

// tslint:disable-next-line no-any
(Config as any).childContextTypes = {
  config: PropTypes.object
}