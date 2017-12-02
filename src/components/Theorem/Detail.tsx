import * as React from 'react'
import { observer } from 'mobx-react'

import * as T from '../../types'

import Implication from '../../containers/Implication'
import Markdown from '../../components/Markdown'
import Tex from '../../components/Tex'

interface Props {
  theorem: T.Theorem
}

@observer
class Detail extends React.Component<Props, {}> {
  render() {
    const { theorem } = this.props

    return (
      <div>
        <h1>
          {theorem.if && theorem.then
            ? <Implication theorem={theorem} link={true} />
            : ' '
          }
        </h1>
        <Tex><Markdown text={theorem.description} /></Tex>
      </div>
    )
  }
}

export default Detail