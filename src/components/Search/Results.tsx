import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as F from '../../models/Formula'
import * as L from '../../logic'
import * as T from '../../types'

import Examples from './Examples'
import Formula from '../Formula'
import Implication from '../Implication'
import TraitTable from '../Trait/Table'

interface Props {
  theorems: I.List<T.Theorem>
  traits: T.TraitTable
  properties: T.Finder<T.Property>
  text?: string
  formula?: F.Formula<T.Property>
  results: I.List<T.Space>
  onSelect: (q: string) => void
}

const Tautology = ({ formula }) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula} link={true} />, tautologically.</p>
  </div>
)

const Disproven = ({ formula, disproof, properties }) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula} link={true} /> due to the following theorems:</p>
    <ul>
      {disproof.map(t => (
        <li key={t.uid}>
          <Link to={`/theorems/${t.uid}`}>
            <Implication theorem={t} properties={properties} link={false} />
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const NoneFound = ({ formula }) => (
  <div>
    <p>No spaces found satisfying <Formula formula={formula} link={true} />. Do you
      know an example from the literature, or can you provide a
      reference proving that no such spaces exist?
      {' '}
      <a href="https://github.com/pi-base/data/blob/master/CONTRIBUTING.md">
        [Go here to learn how to contribute.]
      </a>
    </p>
  </div>
)

function Results({ text, formula, results, onSelect, traits, theorems, properties }: Props) {
  if (!text && !formula) {
    return <Examples className="search-examples" viewExample={onSelect} />
  }

  if (formula && results.size === 0) {
    const f = F.mapProperty(p => p.uid, formula)
    const disproof = L.disprove(theorems, f)
    if (disproof === 'tautology') {
      return <Tautology formula={formula} />
    } else if (disproof) {
      return <Disproven formula={formula} disproof={disproof} properties={properties} />
    } else {
      return <NoneFound formula={formula} />
    }
  }

  const columns: I.List<T.Property> = formula
    ? F.properties(formula).toList()
    : I.List<T.Property>()

  return (
    <TraitTable spaces={results} properties={columns} traits={traits} />
  )
}

export default Results
