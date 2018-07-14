import * as React from 'react'
import * as S from '../../selectors'

import { Property, Prover, Space, State, Theorem } from '../../types'

import { Finder } from '../../models/Finder'
import Implication from '../Implication'
import { Link } from 'react-router-dom'
import TraitTable from '../Trait/Table'
import { connect } from 'react-redux'
import { converse } from '../../logic'

type OwnProps = {
  theorem: Theorem
}
type StateProps = {
  counterexamples: Space[]
  properties: Property[]
  prover: Prover
}
type Props = OwnProps & StateProps

const Counterexamples = ({ theorem, properties, counterexamples, prover }: Props) => {
  // TODO: check DB for recorded converses

  if (counterexamples.length > 0) {
    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable
          spaces={counterexamples}
          properties={properties}
        />
      </aside>
    )
  }

  const proof = prover.prove(converse(theorem))
  if (proof) {
    if (proof === 'tautology') { return <span /> }

    return (
      <aside>
        <p>The converse also holds</p>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th><Implication theorem={converse(theorem)} link={false} /></th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {proof.map(thrm => (
              <tr key={thrm!.uid}>
                <td>
                  <Implication theorem={thrm!} link={false} />
                </td>
                <td>
                  <Link to={`/theorems/${thrm!.uid}`}>{thrm!.uid}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    )
  }

  return <aside>No examples found disproving the converse.</aside>
}

export default connect(
  (state: State, ownProps: OwnProps): StateProps => ({
    counterexamples: S.counterexamples(state, ownProps.theorem),
    properties: S.theoremProperties(state, ownProps.theorem),
    prover: S.prover(state)
  })
)(Counterexamples)
