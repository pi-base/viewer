import React from 'react'
import { connect } from 'react-redux'

import * as Q from '../queries'

import Formula       from './Formula'
import FormulaInput  from './Formula/Input'
import SearchResults from './Search/Results'

class Search extends React.Component {
  constructor() {
    super()

    this.state = {
      formula: null
    }
  }

  searchFor(formula) {
    this.setState({ formula })
  }

  results() {
    return this.props
      .search(this.state.formula)
      .sortBy(s => s.name)
      .toJS()
  }

  render() {
    return (
      <div className="search row">
        <div className="col-md-4">
          <FormulaInput doChange={(f) => this.searchFor(f)}/>
        </div>

        <div className="col-md-8">
          <Formula formula={this.state.formula}/>
          <SearchResults formula={this.state.formula} results={this.results()}/>
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    search: (f) => Q.runSearch(state, f)
  })
)(Search)
