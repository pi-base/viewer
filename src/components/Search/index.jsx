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
      q: '',
      formula: null
    }
  }

  componentWillMount() {
    if (this.props.location.query.q) {
      this.searchFor({ q: this.props.location.query.q })
    }
  }

  componentWillReceiveProps(props) {
    if (props.location && !props.location.query.q) {
      this.setState({ q: '', formula: null })
    }
  }

  searchFor({ q, formula }) {
    const route = `/search?q=${q}`
    if (this.props.location.query.q) {
      this.props.router.replace(route)
    } else {
      this.props.router.push(route)
    }

    formula = formula || this.props.parseFormula(q)

    this.setState({ q, formula })
  }

  results() {
    return this.props.search(this.state.q, this.state.formula)
  }

  render() {
    return (
      <div className="search row">
        <div className="col-md-4">
          <FormulaInput placeholder="Search by formula" q={this.state.q} doChange={this.searchFor.bind(this)}/>
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
    search: (q, f) => Q.runSearch(state, q, f),
    parseFormula: (q) => Q.parseFormula(state, q)
  })
)(Search)
