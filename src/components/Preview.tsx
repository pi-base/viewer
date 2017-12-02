import * as React from 'react'
import { observer } from 'mobx-react'

@observer
class Preview extends React.Component<{ text: string }, {}> {
  render() {
    const { text } = this.props

    // TODO: split at word, TeX boundaries only
    const preview = text.split('\n')[0]
    return <div>{preview}</div>
  }

}

export default Preview
