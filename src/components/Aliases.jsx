import React, { PropTypes } from 'react'
import * as I from 'immutable'


class Aliases extends React.Component {
  render() {
    const aliases = this.props.aliases

    if (!aliases) { return null }

    return <small> or {aliases.join(', ')}</small>
  }
}

Aliases.propTypes = {
  aliases: PropTypes.instanceOf(I.List)
}

export default Aliases
