import * as React from 'react'
import * as I from 'immutable'

import { observer } from 'mobx-react'
import { action, computed, observable, reaction } from 'mobx'
import store from '../../store'

import { Finder } from '../../models/PropertyFinder'
import * as F from '../../models/Formula'
import * as Q from '../../queries'
import * as T from '../../types'

import Suggestions from './Suggestions'

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40 // RIGHT = 39

type Formula = F.Formula<T.Property>

export interface Props {
  q: string
  placeholder: string
  suggestionLimit?: number
  onQueryChange?: (q: string) => void
  onFormulaChange?: (f?: Formula) => void
}

interface Event {
  which: number
  preventDefault: () => void
}

@observer
class FormulaInput extends React.Component<Props, {}> {
  @observable selected: number
  @observable dropdownVisible: boolean

  @observable q: string

  constructor(props: Props) {
    super(props)

    this.selected = 0
    this.dropdownVisible = false

    this.q = this.props.q

    const { onFormulaChange, onQueryChange } = this.props

    if (onQueryChange) {
      reaction(
        () => this.q,
        (q) => {
          onQueryChange(q)
          if (onFormulaChange) {
            const f = Q.parseFormula(store.propertyFinder, q)
            if (f || !q) { onFormulaChange(f) }
          }
        }
      )
    }
  }

  componentWillReceiveProps(newProps: Props) {
    this.q = newProps.q
  }

  @computed get suggestions() {
    return Q.suggestionsFor(store.propertyFinder, this.q, 10)
  }

  @action changeSelection(delta: number) {
    this.selected += delta
  }

  @action expandFragment(index?: number) {
    index = index || this.selected

    const selected = this.suggestions.get(index)
    const updated = Q.replaceFragment(this.props.q, selected.name)

    this.q = updated

    this.selected = 0
    this.dropdownVisible = false
  }

  handleKeyDown(e: Event) {
    if (e.which === ENTER || e.which === UP || e.which === DOWN || e.which === TAB) {
      e.preventDefault()
    }

    switch (e.which) {
      case UP:
        return this.changeSelection(-1)
      case DOWN:
        return this.changeSelection(1)
      case ENTER:
      case TAB:
        return this.expandFragment()
      default:
        return
    }
  }

  @action handleChange(q: string) {
    this.q = q
    this.dropdownVisible = !!q && q[0] !== ':'
  }

  @action handleBlur() {
    this.dropdownVisible = false
  }

  render() {
    return (
      <div>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          value={this.q}
          placeholder={this.props.placeholder}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleChange(e.target.value)}
          onBlur={() => this.dropdownVisible = false}
        />

        <Suggestions
          suggestions={this.suggestions}
          selected={this.selected}
          visible={this.dropdownVisible}
          limit={this.props.suggestionLimit || 10}
          onSelect={(i) => this.expandFragment(i)}
        />
      </div>
    )
  }
}

export default FormulaInput
