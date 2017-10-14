import * as React from 'react'
import * as I from 'immutable'

import { Finder } from '../../models/PropertyFinder'
import * as Q from '../../queries'
import * as T from '../../types'

import Suggestions from './Suggestions'

const TAB = 9, ENTER = 13, UP = 38, DOWN = 40 // RIGHT = 39

export interface Props {
  finder:           Finder<T.Property>
  q:                string
  suggestionLimit?: number
  placeholder:      string
  onChange:         (q: string, formula: (T.Formula | undefined)) => void
}

export interface State {
  selected:        number
  suggestions:     I.List<T.Property>
  dropdownVisible: boolean
}

interface Event {
  which: number
  preventDefault: () => void
}

class FormulaInput extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      selected:        0,
      suggestions:     I.List([]),
      dropdownVisible: false
    }
  }

  parseFormula(str: string) {
    return Q.parseFormula(this.props.finder, str)
  }

  getSuggestions(str: string) {
    return Q.suggestionsFor(this.props.finder, str, 10)
  }

  changeSelection(delta: number) {
    this.setSelection(this.state.selected + delta)
  }

  setSelection(to: number) {
    const limit = Math.min(
      this.props.suggestionLimit || 10,
      this.state.suggestions.size
    )
    if (limit === 0) { return }

    const next = ((to % limit) + limit) % limit || 0
    this.setState({ selected: next })
  }

  expandFragment(index?: number) {
    index = index || this.state.selected

    const selected = this.state.suggestions.get(index)
    const updated  = Q.replaceFragment(this.props.q, selected.name)

    this.props.onChange(updated, this.parseFormula(updated))

    this.setState({ selected: 0, dropdownVisible: false })
  }

  handleKeyDown(e: Event) {
    if (e.which === ENTER || e.which === UP || e.which === DOWN) {
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

  handleChange(q: string) {
    const formula = this.parseFormula(q)

    // Updates for parent component
    this.props.onChange(q, formula)

    // Updates for local state
    const dropdownVisible = !!q && q[0] !== ':'
    this.setState((state: State, props: Props) => {
      if (formula) {
        const suggestions = this.getSuggestions(q)
        return { q, dropdownVisible, formula, suggestions }
      } else {
        return { q, dropdownVisible }
      }
    })
  }

  handleBlur() {
    this.setState({ dropdownVisible: false })
  }

  render() {
    return (
      <div>
        <input
          type="text"
          autoComplete="off"
          className="form-control"
          value={this.props.q}
          placeholder={this.props.placeholder}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={(e) => this.handleChange(e.target.value)}
          onBlur={() => this.handleBlur()}
        />

        <Suggestions
          visible={this.state.dropdownVisible}
          suggestions={this.state.suggestions}
          selected={this.state.selected}
          onSelect={(i) => this.expandFragment(i)}
        />
      </div>
    )
  }
}

export default FormulaInput
