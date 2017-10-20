import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'
import { observer } from 'mobx-react'

import store from '../store'
import * as Q from '../queries'
import * as T from '../types'

import FormulaInput from '../components/Formula/Input'
import Results from '../components/Search/Results'

import * as F from '../models/Formula'
import { Finder } from '../models/PropertyFinder'

type Formula = F.Formula<T.Property>

export interface State {
  q: string
  formula: Formula | undefined
  text: string
}

@observer
class Search extends React.Component<T.RouterProps, State> {
  constructor(props: T.RouterProps) {
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
      formula: this.parseFormula(query.q || ''),
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

  setFormulaFilter({ q, formula }: { q: string, formula: Formula | undefined }) {
    const updates: { q: string, formula: (Formula | undefined) } = { q, formula: undefined }

    formula = formula || this.parseFormula(q)
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
    const f = this.state.formula
      ? F.mapProperty(p => p.uid, this.state.formula)
      : undefined

    return store.search({ text: this.state.text, formula: f })
  }

  parseFormula(q: string) {
    return Q.parseFormula(store.propertyFinder, q)
  }

  render() {
    const results = this.results()

    // TODO: add widget to allow displaying extra traits inline
    return (
      <div className="search row">
        <div className="col-md-4">
          <Link to="/spaces/new" className="btn btn-default btn-sm">New</Link>
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
              finder={store.propertyFinder}
              q={this.state.q}
              placeholder="e.g. compact + ~metrizable"
              onChange={(q, formula) => this.setFormulaFilter({ q, formula })}
            />
          </div>
        </div>

        <div className="col-md-8">
          <Results
            theorems={store.theorems.all}
            traits={store.traits.values}
            properties={store.propertyFinder}
            text={this.state.text}
            formula={this.state.formula}
            results={results}
            onSelect={(q) => this.setFormulaFilter({ q, formula: undefined })}
          />
        </div>
      </div>
    )
  }
}

export default Search