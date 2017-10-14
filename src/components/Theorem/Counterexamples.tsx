import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as L from '../../logic'
import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../Implication'
import TraitTable  from '../Trait/Table'

export interface Props {
  spaces: I.List<T.Space>
  traits: T.TraitTable
  theorems: I.List<T.Theorem>
  theorem: T.Theorem
}

function converse(theorem: T.Theorem) {
  return {
    ... theorem,
    if: theorem.then,
    then: theorem.if
  }
}

function Counterexamples({ spaces, traits, theorems, theorem }: Props) {

  const counterexamples = Q.counterexamples(spaces, traits, theorem)
  const proofOfConverse = L.proveConverse(theorems, theorem)

  if (counterexamples.size > 0) {
    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable 
          spaces={counterexamples} 
          properties={Q.theoremProperties(theorem).toList()}
          traits={traits}
        />
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

export default Counterexamples
