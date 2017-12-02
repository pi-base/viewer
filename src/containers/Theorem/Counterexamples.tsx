import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import store from '../../store'

import * as L from '../../logic'
import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../../containers/Implication'
import TraitTable from '../../components/Trait/Table'

import { Finder } from '../../models/Finder'

export interface Props {
  theorem: T.Theorem
}

function converse(theorem: T.Theorem) {
  return {
    ...theorem,
    if: theorem.then,
    then: theorem.if
  }
}

const Counterexamples = ({ theorem }: Props) => {

  const counterexamples = store.counterexamples(theorem)
  const proofOfConverse = L.proveConverse(store.theorems.all, theorem)

  const theoremProperties: I.List<T.Property> = Q.theoremProperties(theorem)
    .map(uid => store.properties.find(uid!)).toList()

  if (counterexamples.size > 0) {
    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable
          spaces={counterexamples}
          properties={store.theoremProperties(theorem)}
        />
      </aside>
    )
  }

  if (proofOfConverse) {
    if (proofOfConverse === 'tautology') { return <span /> }

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
            {proofOfConverse.map((thrm: T.Theorem) => (
              <tr key={thrm.uid}>
                <td>
                  <Implication theorem={thrm} link={false} />
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
