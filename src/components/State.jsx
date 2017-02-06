import React from 'react'
import {connect} from 'react-redux'

import JSONTree from 'react-json-tree'

class State extends React.Component {
  constructor() {
    super()
    this.state = { expanded: false }
  }

  toggle() { this.setState({ expanded: !this.state.expanded })}

  render() {
    const { state } = this.props
    const klass = this.state.expanded ? 'default' : 'primary'

    return (
      <div>
        { this.state.expanded
        ? <JSONTree data={state}/>
        : '' }

        <button
          className={`btn btn-${klass}`}
          onClick={this.toggle.bind(this)}>View State</button>
      </div>
    )
  }
}

export default connect(
  (state) => { return { state } }
)(State)
