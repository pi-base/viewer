import React from 'react'
import { connect } from 'react-redux'

import * as Q from '../../queries'

import Examples      from './Examples'
import FormulaInput  from '../Formula/Input'
import Results       from './Results'

class Search extends React.Component {
  constructor() {
    super()

    this.state = {
      formula: null
    }
  }

  searchFor(formula) {
    // TODO: when selecting an example, show the selected q
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
          { this.state.formula
          ? <Results formula={this.state.formula} results={this.results()}/>
          : <Examples onSelect={this.searchFor.bind(this)}/>
          }
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
