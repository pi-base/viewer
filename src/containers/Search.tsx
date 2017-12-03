import * as React from 'react'
import { Link } from 'react-router-dom'
import * as I from 'immutable'
import { observer } from 'mobx-react'
import { action, computed, observable, reaction } from 'mobx'

import store from '../store'
import * as Q from '../queries'
import * as T from '../types'

import FormulaInput from '../components/Formula/Input'
import Results from '../components/Search/Results'

import * as F from '../models/Formula'
import { Finder } from '../models/Finder'

type Formula = F.Formula<T.Property>

@observer
class Search extends React.Component<T.RouterProps, {}> {
  @observable text: string
  @observable q: string
  @observable formula: Formula | undefined

  constructor(props: T.RouterProps) {
    super(props)

    this.text = ''
    this.q = ''

    reaction(
      () => ({ text: this.text, formula: this.formula }),
      () => this.setPath(),
      { delay: 500 }
    )
  }

  componentWillMount() {
    const { query } = this.props.router.location
    this.text = query.text || ''
    this.q = query.q || ''
  }

  setPath() {
    let query = ''
    if (this.q) {
      query += '&q=' + encodeURIComponent(this.q)
    }
    if (this.text) {
      query += '&text=' + encodeURIComponent(this.text)
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

  @computed get results() {
    const f = this.formula
      ? F.mapProperty(p => p.uid, this.formula)
      : undefined

    return store.search({ text: this.text, formula: f })
  }

  @action setFormulaFilter(opts: { q: string, formula?: Formula }) {
    const { q, formula } = opts
    this.q = q
    this.formula = formula
  }

  handleFormulaChange(formula: Formula | undefined) {
    this.formula = formula
  }

  render() {
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
              value={this.text}
              onChange={e => this.text = e.target.value}
            />
          </div>

          <div className="form-group">
            <label htmlFor="formulaFilter">Filter by Formula</label>
            <FormulaInput
              q={this.q}
              placeholder="e.g. compact + ~metrizable"
              onQueryChange={(q) => this.q = q}
              onFormulaChange={(f) => this.handleFormulaChange(f)}
            />
          </div>
        </div>

        <div className="col-md-8">
          <Results
            theorems={store.theorems.all}
            traits={store.traits.values}
            properties={store.propertyFinder}
            text={this.text}
            formula={this.formula}
            results={this.results}
            onSelect={q => this.setFormulaFilter({ q, formula: undefined })}
          />
        </div>
      </div>
    )
  }
}

export default Search