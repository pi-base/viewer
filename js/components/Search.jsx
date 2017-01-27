import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import Json from './Json'

import { search } from '../actions'
import * as queries from '../queries'

const ExampleSearches = ({ runSearch }) => {
  return (
    <div>
      <ul>
        <li><a onClick={() => runSearch('compact + connected')}>a</a></li>
        <li><a onClick={() => runSearch('first countable + separable + ~second countable')}>b</a></li>
      </ul>
    </div>
  )
}

// <FormulaInput {...query} onKeyUp={(e) => doSearch(e.target.value)}/>

class Search extends React.Component {
  render() {
    const { q, formula, results, runSearch } = this.props

    return (
      <form className="search row">
          <div className="col-md-4">
              <Field name="q" component="input" type="text" placeholder="search"/>
              <p>Formula: <Json value={formula}/></p>

              <li><a onClick={() => runSearch('a')}>a</a></li>
              <li><a onClick={() => runSearch('b')}>b</a></li>
          </div>
          <div className="col-md-8">
          </div>
      </form>
    )
  }
}

const searchQuery   = (state) => { return state.search.q }
const searchResults = (state) => { return state.search.results }

const SearchForm = reduxForm({
  form: 'search'
})(Search)

export default connect(
  (state) => ({
      initialValues: {
          q: queries.searchQ(state)
      },
      q:       queries.searchQ(state),
      results: queries.searchResults(state),
      formula: queries.searchFormula(state)
  }),
  { runSearch: search }
)(SearchForm)
