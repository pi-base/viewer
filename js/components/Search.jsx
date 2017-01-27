import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'

import { search } from '../actions'

const ExampleSearches = ({ runSearch }) => {
  return (
    <div>
      <ul>
        <li><a onClick={() => runSearch('a')}>a</a></li>
        <li><a onClick={() => runSearch('b')}>b</a></li>
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
              <pre>q: {q}</pre>
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
          q: 'test'
      }
      // q:       searchQuery(state),
      // results: searchResults(state),
      // formula: null
  }),
  { runSearch: search }
)(SearchForm)
