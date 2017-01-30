import React from 'react'
import {connect} from 'react-redux'
import {Field} from 'redux-form'

class FormulaInput extends React.Component {
  constructor() {
    super()
    this.selected = 0
    this.dropdownVisible = false
  }

  render() {
    let { name, suggestions } = this.props

    return (<div>
      <Field
        component    = "input"
        type         = "text"
        autoComplete = "off"
        className    = "form-control"
        name         = {name}
      ></Field>
      <div className="list-group">
        {JSON.stringify(suggestions)}
      </div>
    </div>)
  }
}

export default connect(
  (state) => ({
    suggestions: ['TODO: add property name suggestions']
  })
)(FormulaInput)
