import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as I from 'immutable'

import * as Q from '../../queries'

import Suggestions from './Suggestions'

const TAB = 9, ENTER = 13, UP = 38, RIGHT = 39, DOWN = 40

class FormulaInput extends React.Component {
  constructor() {
    super()
    this.state = {
      selected:        0,
      suggestions:     I.List([]),
      dropdownVisible: false
    }
  }
  changeSelection(delta) {
    this.setSelection(this.state.selected + delta)
  }

  setSelection(to) {
    const limit = Math.min(
      this.props.suggestionLimit || 10,
      this.state.suggestions.size
    )
    if (limit === 0) { return }

    const next = ((to % limit) + limit) % limit || 0
    this.setState({ selected: next })
  }

  expandFragment(index) {
    index = index || this.state.selected
    const selected = this.state.suggestions.get(''+index)
    const updated  = Q.replaceFragment(this.props.q, selected.get('name'))

    this.props.onChange({
      q:       updated,
      formula: this.props.parseFormula(updated)
    })

    this.setState({ selected: 0, dropdownVisible: false })
  }

  handleKeyDown(e) {
    if ([ENTER, DOWN, UP].includes(e.which)) {
      e.preventDefault()
    }

    switch (e.which) {
    case UP:
      return this.changeSelection(-1)
    case DOWN:
      return this.changeSelection(1)
    case ENTER:
    case TAB:
    case RIGHT:
      return this.expandFragment()
    default:
      return
    }
  }

  handleChange(q) {
    const { parseFormula, suggestions } = this.props
    const formula = parseFormula(q)

    // Updates for parent component
    let updates = { q }
    if (formula) {
      updates.formula = formula
    }
    this.props.onChange(updates)

    // Updates for local state
    const dropdownVisible = !!q && q[0] !== ':'
    updates = { q, dropdownVisible }
    if (formula) {
      updates.formula     = formula
      updates.suggestions = suggestions(q)
    }
    this.setState(updates)
  }

  handleBlur(e) {
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
          onKeyDown={this.handleKeyDown.bind(this)}
          onChange={(e) => this.handleChange(e.target.value)}
          onBlur={this.handleBlur.bind(this)}
        />

        <Suggestions
          visible={this.state.dropdownVisible}
          suggestions={this.state.suggestions}
          selected={this.state.selected}
          onSelect={this.expandFragment.bind(this)}
        />
      </div>
    )
  }
}

FormulaInput.propTypes = {
  q: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  suggestionLimit: PropTypes.number,
  placeholder: PropTypes.string
}

export default connect(
  (state) => ({
    parseFormula: (str) => Q.parseFormula(state, str),
    suggestions: (str) => Q.suggestionsFor(state, str, 10)
  })
)(FormulaInput)
