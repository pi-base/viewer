import * as React from 'react'
import { observer } from 'mobx-react'

import { view } from '../graph'

@observer
class Properties extends React.Component<any, {}> {
  render() {
    return this.props.children
  }
}

export default view(`
  properties {
    uid
    name
    # FIXME: aliases
    description
  }
`)(Properties)