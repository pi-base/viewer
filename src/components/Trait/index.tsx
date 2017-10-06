import * as React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'
import * as T from '../../types'

import Icon     from '../Icon'
import Markdown from '../Markdown'
import Proof    from '../Proof'
import Tex      from '../Tex'

interface Props {
  trait: T.Trait
  params: {
    spaceId: string
    propertyId: string
  }
}

interface State {
  showProperty: boolean
}

class Trait extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { showProperty: false }
  }

  toggleShowProperty() {
    this.setState({ showProperty: !this.state.showProperty })
  }

  render() {
    const { trait } = this.props
    if (!trait) { return null }

    const label = trait.value === false ? '¬' : ''

    return (
      <div>
        <h3>
          {label}{trait.property.name}
          {' '}
          <button
            className="btn btn-default btn-xs"
            onClick={() => this.toggleShowProperty()}
          >
            <Icon type="question-sign"/>
          </button>
        </h3>

        { this.state.showProperty
        ? (
            <Tex className="well">
              <Markdown text={trait.property.description}/>
            </Tex>
        ) : ''}

        <Proof space={trait.space} trait={trait}/>
      </div>
    )
  }
}

function mapStateToProps(state: T.StoreState, { params }: Props) {
  return {
    trait: Q.findTrait(state, params.spaceId, params.propertyId)
  }
}

export default connect(mapStateToProps)(Trait)
