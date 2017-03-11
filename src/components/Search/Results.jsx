import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as I from 'immutable'

import * as F from '../../models/Formula'
import * as L from '../../logic'

import Examples    from './Examples'
import Formula     from '../Formula'
import Implication from '../Implication'
import TraitTable  from '../Trait/Table'

const Tautology = ({ formula }) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula}/>, tautologically.</p>
  </div>
)

const Disproven = ({formula, disproof}) => (
  <div>
    <p>No spaces exist satisfying <Formula formula={formula}/> due to the following theorems:</p>
    <ul>
      {disproof.map(t =>
        <li key={t.get('uid')}>
          <Link to={`/theorems/${t.get('uid')}`}>
            <Implication theorem={t} link={false}/>
          </Link>
        </li>
      )}
    </ul>
  </div>
)

const NoneFound = ({formula}) => (
  <div>
    <p>No spaces found satisfying <Formula formula={formula}/>. Do you
      know an example from the literature, or can you provide a
      reference proving that no such spaces exist?
      {' '}
      <a href="https://github.com/jamesdabbs/pi-base-data/blob/master/CONTRIBUTING.md">
        [Go here to learn how to contribute.]
      </a>
    </p>
  </div>
)

class Results extends React.Component {
  render() {
    const { text, formula, results, onSelect } = this.props

    if (!text && !formula) {
      return <Examples className="search-examples" onSelect={onSelect}/>
    }

    if (formula && results.size === 0) {
      const disproof = this.props.disprove(formula)
      if (disproof === L.TAUTOLOGY) {
        return <Tautology formula={formula}/>
      } else if (disproof) {
        return <Disproven formula={formula} disproof={disproof}/>
      } else {
        return <NoneFound formula={formula}/>
      }
    }

    const properties = formula ? formula.properties().toList() : I.List()

    return (
      <TraitTable spaces={results} properties={properties}/>
    )
  }
}

Results.propTypes = {
  results: PropTypes.instanceOf(I.List).isRequired,
  onSelect: PropTypes.func.isRequired,
  text: PropTypes.string,
  formula: PropTypes.instanceOf(F.Formula),
  properties: PropTypes.instanceOf(I.List)
}

export default connect(
  (state) => ({
    disprove: (f) => L.disprove(state, f)
  })
)(Results)
