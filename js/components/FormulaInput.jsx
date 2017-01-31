import React from 'react'
import {connect} from 'react-redux'
import {Field} from 'redux-form'

import * as Q from '../queries'

const TAB = 9, ENTER = 13, UP = 38, RIGHT = 39, DOWN = 40

const PropertySuggestions = ({ suggestions, selected, visible, onSelect}) => {
  const divStyle = {
    display:   (visible ? 'block' : 'none'),
    // position:  'absolute',
    // width:     '100%', // FIXME
    marginTop: '5px'
  }

  return (
    <div className="list-group" style={divStyle}>
      {suggestions.map((p,i) =>
        <a className={"list-group-item " + (selected == i ? "active" : "")}
          key={p.id}
          onMouseDown={() => onSelect(i)}
          href="#">
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
    const next  = ((to % limit) + limit) % limit
    this.setState({ selected: next })
  }

  expandFragment() {
    const selected = this.props.suggestions[this.state.selected]
    this.setState({ selected: 0, dropdownVisible: false })
  }

  handleKeyUp(e) {
    if ([ENTER, DOWN, UP].includes(e.which)) {
      e.preventDefault()
    }

    switch (e.which) {
      case UP:
        return this.changeSelection(-1)
      case DOWN:
        return this.changeSelection(1)
      case ENTER:
        return this.expandFragment()
    }
  }

  handleChange(e) {
    // e.target.value
    this.setState({ dropdownVisible: true })
  }

  handleBlur(e) {
    this.setState({ dropdownVisible: false })
  }

  render() {
    let { name, value, suggestions, fragment } = this.props

    console.log('val', value)

    return (<div>
      <Field
        component    = "input"
        type         = "text"
        autoComplete = "off"
        className    = "form-control"
        name         = {name}
        onKeyUp      = {this.handleKeyUp.bind(this)}
        onChange     = {this.handleChange.bind(this)}
        onBlur       = {this.handleChange.bind(this)}
      />
      <PropertySuggestions
        visible     = {this.state.dropdownVisible}
        suggestions = {this.props.suggestions}
        selected    = {this.state.selected}
        onSelect    = {this.expandFragment.bind(this)}
      />
      <pre>
        Fragment: {fragment} {"\n"}
        Selected: {this.state.selected} {"\n"}
        Visible:  {''+this.state.dropdownVisible}
      </pre>
    </div>)
  }
}

export default connect(
  (state, ownProps) => ({
    suggestions: Q.suggestionsFor(state, ownProps.value)
  })
)(FormulaInput)
