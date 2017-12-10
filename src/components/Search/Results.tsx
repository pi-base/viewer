import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { State } from '../../reducers'
import * as F from '../../models/Formula'
import * as L from '../../logic'
import * as S from '../../selectors'
import * as T from '../../types'

import Examples from './Examples'
import Formula from '../Formula'
import Implication from '../Implication'
import TraitTable from '../Trait/Table'

type StateProps = {
  text: string | undefined
  formula: T.Formula<T.Property> | undefined
  results: T.Space[]
  prover: T.Prover
}
type Props = StateProps

const Tautology = ({ formula }) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula} link={true} />, tautologically.</p>
  </div>
)

const Disproven = ({ formula, disproof }) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula} link={true} /> due to the following theorems:</p>
    <ul>
      {disproof.map(t => (
        <li key={t.uid}>
          <Link to={`/theorems/${t.uid}`}>
            <Implication theorem={t} link={false} />
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

function Results({ text, formula, results, prover }: Props) {
  if (!text && !formula) {
    return <Examples className="search-examples" />
  }

  if (formula && results.length === 0) {
    const disproof = prover.disprove(
      F.mapProperty(p => p.uid, formula)
    )
    if (disproof === 'tautology') {
      return <Tautology formula={formula} />
    } else if (disproof) {
      return <Disproven formula={formula} disproof={disproof} />
    } else {
      return <NoneFound formula={formula} />
    }
  }

  const columns = formula ? Array.from(F.properties(formula)) : []
  return (
    <TraitTable spaces={results} properties={columns} />
  )
}

const mapStateToProps = (state: State): StateProps => ({
  text: state.search.text,
  formula: S.searchFormula(state),
  results: S.searchResults(state),
  prover: S.prover(state)
})

export default connect<{}, StateProps>(
  mapStateToProps
)(Results)
