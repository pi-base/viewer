import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as F from '../../models/Formula'
import * as Q from '../../queries'

import FormulaInput from '../Formula/Input'
import Results      from './Results'

class Search extends React.Component {
  constructor() {
    super()

    this.state = {
      q: '',
      formula: null,
      text: '',
      properties: []
    }
  }

  componentWillMount() {
    const { query } = this.props.location
    this.setState({
      q: query.q || '',
      formula: this.props.parseFormula(query.q),
      text: query.text || ''
    })
  }

  setPath({ q, text }) {
    let query = ''
    if (q) {
      query += 'q=' + encodeURIComponent(q)
    }
    if (text) {
      query += 'text=' + encodeURIComponent(text)
    }

    let path = '/spaces'
    if (query) {
      path += `?${query}`
    }

    // Want a history entry for /search, but not for each letter
    if (this.props.location.query) {
      this.props.router.replace(path)
    } else {
      this.props.router.push(path)
    }
  }

  setFormulaFilter({ q, formula }) {
    const updates = { q }

    formula = formula || this.props.parseFormula(q)
    if (formula) {
      updates.formula = formula
    } else if (!q) {
      updates.formula = null
    }

    this.setPath({ q, text: this.state.text })
    this.setState(updates)
  }

  setTextFilter(text) {
    this.setPath({ q: this.state.q, text })
    this.setState({ text })
  }

  results() {
    const { filter } = this.props
    const spaces = filter({ text: this.state.text })
    return filter({ spaces: spaces, formula: this.state.formula, value: true }).valueSeq().toList()
  }

  render() {
    const results    = this.results()
    const properties = this.state.properties.concat(F.properties(this.state.formula))

    // TODO: add widget to allow displaying extra traits inline
    return (
      <div className="search row">
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="textFilter">Filter by Text</label>
            <input
              className="form-control"
              name="textFilter"
              placeholder="e.g. plank"
              value={this.state.text}
              onChange={(e) => this.setTextFilter(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="formulaFilter">Filter by Formula</label>
            <FormulaInput
              name="formulaFilter"
              placeholder="e.g. compact + ~metrizable"
              q={this.state.q}
              onChange={this.setFormulaFilter.bind(this)}
            />
          </div>
        </div>

        <div className="col-md-8">
          <Results
            text={this.state.text}
            formula={this.state.formula}
            results={results}
            properties={I.List(properties)}
            onSelect={this.setFormulaFilter.bind(this)}
          />
        </div>
      </div>
    )
  }
}

Search.propTypes = {
  filter: PropTypes.func.isRequired,
  parseFormula: PropTypes.func.isRequired
}

export default connect(
  (state) => ({
    parseFormula: (q) => Q.parseFormula(state, q),
    filter: (opts) => Q.filter(state, opts)
  })
)(Search)
