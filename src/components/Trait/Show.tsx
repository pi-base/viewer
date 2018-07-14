import * as React from 'react'
import * as S from '../../selectors'
import * as T from '../../types'

import EditLink from '../Form/EditLink'
import Icon from '../Icon'
import Markdown from '../Markdown'
import Proof from '../Proof'
import { RouteComponentProps } from 'react-router'
import Tex from '../Tex'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

type OwnProps = {
  space: T.Space
}
type StateProps = {
  trait: T.Trait | undefined
}
type Props = OwnProps & StateProps & RouteComponentProps<{ propertyId: string }>

type State = {
  showProperty: boolean
}

const Edit = withRouter(({ match }) => (
  <EditLink to={match.url + '/edit'} className="btn btn-default btn-xs">
    Edit
  </EditLink>
))

const Question = ({ onClick }) => (
  <button
    className="btn btn-default btn-xs"
    onClick={onClick}
  >
    <Icon type="question-sign" />
  </button>
)

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
          <Question onClick={() => this.toggleShowProperty()} />
          <Edit />
        </h3>

        {this.state.showProperty &&
          <Tex className="well">
            <Markdown text={trait.property.description} />
          </Tex>
        }

        <Proof trait={trait} />
      </div>
    )
  }
}

export default connect<StateProps, {}, OwnProps, T.State>(
  (state: T.State, props: Props): StateProps => ({
    trait: S.getTrait(state, props.space, props.match.params.propertyId)
  })
)(Trait)
