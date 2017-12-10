import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as S from '../../selectors'
import { Proof, State, Trait } from '../../types'

import Implication from '../Implication'
import Markdown from '../Markdown'
import Tex from '../Tex'

type OwnProps = {
  trait: Trait
}
type StateProps = {
  proof: Proof | undefined
}
type Props = OwnProps & StateProps

function Proof({ trait, proof }: Props) {
  if (proof) {
    return (
      <div className="proofExplorer">
        <p>Automatically deduced from the following properties</p>
        <ul>
          {proof.traits.map(t => (
            <li key={`prop${t.property.uid}`}>
              <Link to={`/spaces/${trait.space.uid}/properties/${t.property.uid}`}>
                {t.value ? '' : '¬'}
                <Tex component="span">{t.property.name}</Tex>
              </Link>
            </li>
          ))}
        </ul>

        <p>and theorems</p>
        <ul>
          {proof.theorems.map(t => (
            <li key={`implication${t.uid}`}>
              <Link to={`/theorems/${t.uid}`}>
                <Implication theorem={t} link={false} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  } else if (trait.description) {
    return <Tex><Markdown text={trait.description} /></Tex>
  } else {
    return (
      <p>
        <i>No proof given</i>
      </p>
    )
  }
}

export default connect<StateProps, {}, OwnProps>(
  (state: State, ownProps: OwnProps): StateProps => ({
    proof: S.proof(state, ownProps.trait.space.uid, ownProps.trait.property.uid)
  })
)(Proof)
