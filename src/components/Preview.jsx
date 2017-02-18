import React, { PropTypes } from 'react'

class Preview extends React.Component {
  render () {
    const { text } = this.props
    const preview = text.split("\n")[0]

    return <div>{preview}</div>
  }
}

Preview.propTypes = {
  text: PropTypes.string.isRequired
}

export default Preview;
