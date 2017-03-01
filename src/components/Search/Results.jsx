import React, { PropTypes } from 'react'
import * as I from 'immutable'

import * as F from '../../models/Formula'

import Examples   from './Examples'
import Formula    from '../Formula'
import TraitTable from '../Trait/Table'

class Results extends React.Component {
  render() {
    const { text, formula, results, properties, onSelect } = this.props

    if (!text && !formula) {
      return <Examples onSelect={onSelect}/>
    }
    if (results.size === 0) {
      return <div>
        <p>No results found for formula <Formula formula={formula}/></p>
      </div>
    }

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

export default Results
