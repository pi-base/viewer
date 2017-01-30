import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import { search } from '../actions'
import * as queries from '../queries'

import SearchResults from './search/Results'
import Formula from './Formula'
import FormulaInput from './FormulaInput'

const ExampleSearches = ({ runSearch }) => {
  const example = (label) => (
    <li><a onClick={() => runSearch(label)}>{label}</a></li>
  )
  return (
    <div>
      <ul>
        {example('compact + connected')}
        {example('first countable + separable + ~second countable')}
      </ul>
    </div>
  )
}

class Search extends React.Component {
  render() {
    const { q, formula, results, runSearch } = this.props

    return (
      <form className="search row">
        <div className="col-md-4">
          <FormulaInput name="q"/>
        </div>
        <div className="col-md-8">
          { q && formula
          ? <SearchResults formula={formula}/>
          : <ExampleSearches runSearch={runSearch}/>}
        </div>
      </form>
    )
  }
}

const SearchForm = reduxForm({
  form: 'search'
})(Search)

export default connect(
  (state) => ({
    initialValues: {
      q: queries.searchQ(state)
    },
    q:       queries.searchQ(state),
    formula: queries.searchFormula(state)
  }),
  { runSearch: search }
)(SearchForm)
