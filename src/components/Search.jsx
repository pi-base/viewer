import React from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import * as A from '../actions'
import * as Q from '../queries'

import ExampleSearches from './Search/Examples'
import SearchResults from './Search/Results'
import FormulaInput from './Formula/Input'


class Search extends React.Component {
  render() {
    const { q, formula, runSearch } = this.props

    return (
      <form className="search row">
        <div className="col-md-4">
          <FormulaInput name="q" value={q}/>
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
    q:       Q.searchQ(state),
    formula: Q.searchFormula(state)
  }),
  (dispatch) => ({
    runSearch: (q) => dispatch(A.search(q))
  })
)(SearchForm)
