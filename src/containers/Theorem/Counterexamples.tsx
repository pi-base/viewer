import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as L from '../../logic'
import * as Q from '../../queries'
import * as T from '../../types'

import Implication from '../../containers/Implication'
import TraitTable from '../../components/Trait/Table'

import { Finder } from '../../models/PropertyFinder'

export interface Props {
  spaces: I.List<T.Space>
  traits: T.TraitMap
  theorems: I.List<T.Theorem>
  properties: T.Finder<T.Property>
  theorem: T.Theorem
}

interface StoreProps { }

function converse(theorem: T.Theorem) {
  return {
    ...theorem,
    if: theorem.then,
    then: theorem.if
  }
}

function Counterexamples({ spaces, traits, theorems, properties, theorem }: Props) {

  const counterexamples = Q.counterexamples(spaces, traits, theorem)
  const proofOfConverse = L.proveConverse(theorems, theorem)

  const theoremProperties: I.List<T.Property> = Q.theoremProperties(theorem)
    .map(uid => properties.records.get(uid!)).toList()

  if (counterexamples.size > 0) {
    return (
      <aside>
        <p>This implication does not reverse, as shown by</p>
        <TraitTable
          spaces={counterexamples}
          properties={theoremProperties}
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
              <th><Implication theorem={converse(theorem)} properties={properties} link={false} /></th>
              <th>By</th>
            </tr>
          </thead>
          <tbody>
            {proofOfConverse.map((thrm: T.Theorem) => (
              <tr key={thrm.uid}>
                <td>
                  <Implication theorem={thrm} properties={properties} link={false} />
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

export default connect(
  (state) => {
    const properties = new Finder(state.viewer.properties.valueSeq())
    return {
      spaces: state.viewer.spaces.valueSeq().toList(),
      theorems: state.viewer.theorems.valueSeq().toList(),
      traits: state.viewer.traits,
      properties
    }
  }
)(Counterexamples)
