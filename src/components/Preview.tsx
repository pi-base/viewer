import * as React from 'react'

class Preview extends React.Component<{ text: string }, {}> {
  render() {
    const { text } = this.props

    // TODO: split at word, TeX boundaries only
    const preview = text ? text.split('\n')[0] : ''
    return <div>{preview}</div>
  }

}

export default Preview
