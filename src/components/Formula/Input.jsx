import React from 'react'
import {connect} from 'react-redux'
import {Field} from 'redux-form'

import * as Q from '../../queries'

const TAB = 9, ENTER = 13, UP = 38, RIGHT = 39, DOWN = 40

const PropertySuggestions = ({ suggestions, selected, visible, onSelect }) => {
  const divStyle = {
    display:   (visible ? 'block' : 'none'),
    marginTop: '5px'
  }

  return (
    <div className="list-group" style={divStyle}>
      {suggestions.map((p,i) =>
        <a
          className={"list-group-item " + (selected === i ? "active" : "")}
          key={p.id}
          onMouseDown={() => onSelect(i)}
          href="#"
        >
          {p.name}
        </a>
      )}
    </div>
  )
}

class FormulaInput extends React.Component {
  constructor() {
    super()
    this.state = {
      selected:        0,
      dropdownVisible: false
    }
  }

  changeSelection(delta) {
    this.setSelection(this.state.selected + delta)
  }

  setSelection(to) {
    const limit = Math.min(
      this.props.suggestionLimit || 10,
      this.props.suggestions.length
    )
    if (limit === 0) { return }

    const next  = ((to % limit) + limit) % limit
    this.setState({ selected: next })
  }

  expandFragment(index) {
    index = index || this.state.selected
    const selected = this.props.suggestions[index]

    console.log('TODO: replace fragment with', selected)

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

  handleChange(e) {
    this.setState({ dropdownVisible: true })
  }

  handleBlur(e) {
    this.setState({ dropdownVisible: false })
  }

  render() {
    return (<div>
      <Field
        component="input"
        type="text"
        autoComplete="off"
        className="form-control"
        name={this.props.name}
        onKeyDown={this.handleKeyDown.bind(this)}
        onChange={this.handleChange.bind(this)}
        onBlur={this.handleChange.bind(this)}
      />
      <PropertySuggestions
        visible={this.state.dropdownVisible}
        suggestions={this.props.suggestions}
        selected={this.state.selected}
        onSelect={this.expandFragment}
      />
    </div>)
  }
}

export default connect(
  (state, ownProps) => ({
    suggestions: Q.suggestionsFor(state, ownProps.value)
  })
)(FormulaInput)
