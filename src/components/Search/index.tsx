import * as React from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'
import * as T from '../../types'

import FormulaInput from '../Formula/Input'
import Results      from './Results'

interface Filterable {
  text?:    string
  formula?: T.Formula
  spaces?:  I.List<T.Space>
}

interface StoreProps {
  filter: ({text, formula, spaces}: Filterable) => I.List<T.Space>
  parseFormula: (q: string) => (T.Formula | undefined)
}

export interface State {
  q: string
  formula: T.Formula | undefined
  text: string
}

class Search extends React.Component<StoreProps & T.RouterProps, State> {
  constructor(props: StoreProps & T.RouterProps) {
    super(props)
    this.state = {
      q: '',
      formula: undefined,
      text: ''
    }
  }

  componentWillMount() {
    const { query } = this.props.router.location
    this.setState({
      q: query.q || '',
      formula: this.props.parseFormula(query.q || ''),
      text: query.text || ''
    })
  }

  setPath({ q, text }: { q: string, text: string }) {
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
    if (this.props.router.location.query) {
      this.props.router.replace(path)
    } else {
      this.props.router.push(path)
    }
  }

  setFormulaFilter({ q, formula }: { q: string, formula: T.Formula | undefined }) {
    const updates: { q: string, formula: (T.Formula | undefined) } = { q, formula: undefined }

    formula = formula || this.props.parseFormula(q)
    if (formula) {
      updates.formula = formula
    } else if (!q) {
      updates.formula = undefined
    }

    this.setPath({ q, text: this.state.text })
    this.setState(updates)
  }

  setTextFilter(text: string) {
    this.setPath({ q: this.state.q, text })
    this.setState({ text })
  }

  results() {
    const { filter } = this.props
    const spaces = filter({ text: this.state.text })
    return filter({ spaces: spaces, formula: this.state.formula }).valueSeq().toList()
  }

  render() {
    const results = this.results()

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
              q={this.state.q}
              placeholder="e.g. compact + ~metrizable"
              onChange={(q, formula) => this.setFormulaFilter({q, formula})}
            />
          </div>
        </div>

        <div className="col-md-8">
          <Results
            text={this.state.text}
            formula={this.state.formula}
            results={results}
            onSelect={(q) => this.setFormulaFilter({q, formula: undefined})}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: T.StoreState): StoreProps {
  return {
    parseFormula: (q) => Q.parseFormula(state, q),
    filter: ({ text, formula, spaces }: Filterable) => Q.filter(state, { text, formula, spaces })
  }
}

export default connect<StoreProps, {}, T.RouterProps>(mapStateToProps)(Search)
