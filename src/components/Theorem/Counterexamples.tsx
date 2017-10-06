import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as L from '../../logic'
import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../Implication'
import TraitTable  from '../Trait/Table'

export interface Props {
  theorem: T.Theorem
}

interface StoreProps {
  counterexamples: I.List<T.Space>
  proofOfConverse: L.Disproof | undefined // TODO: this type name is unfortunate
}

function converse(theorem: T.Theorem) {
  return {
    ... theorem,
    if: theorem.then,
    then: theorem.if
  }
}

function Counterexamples({ theorem, counterexamples, proofOfConverse }: Props & StoreProps) {
  if (counterexamples.size > 0) {
    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable spaces={counterexamples} properties={Q.theoremProperties(theorem).toList()}/>
      </aside>
    )
  }

  if (proofOfConverse) {
    if (proofOfConverse === 'tautology') { return <span/> }

    return (
      <aside>
        <p>The converse also holds</p>
        <table className="table table-condensed">
          <thead>
            <tr>
              <th><Implication theorem={converse(theorem)} link={false}/></th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {proofOfConverse.map((thrm: T.Theorem) => (
              <tr key={thrm.uid}>
                <td>
                  <Implication theorem={thrm} link={false}/>
                </td>
                <td>
                  <Link to={`/theorems/${thrm.uid}`}>{thrm.uid}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>
    )
  }

  return <aside>No examples found disproving the converse.{theorem.converse}</aside>
}

function mapStateToProps(state: T.StoreState, props: Props): StoreProps {
  return {
    counterexamples: Q.counterexamples(state, props.theorem).toList(),
    proofOfConverse: L.proveConverse(state, props.theorem)
  }
}

export default connect(mapStateToProps)(Counterexamples)
