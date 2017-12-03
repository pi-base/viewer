import * as React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import Labeled from '../../components/Form/Labeled'
import FormulaInput from '../../components/Formula/Input'
import { addTheorem } from '../../actions'

const validate = values => {
  const errors = {} as any
  if (!values.if) {
    errors.if = 'Required'
  }
  if (!values.then) {
    errors.then = 'Required'
  }
  console.log('create theorem', values, errors)
  // TODO: check for counterexamples
  return errors
}

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
    <div className="form-group">
      <label htmlFor={input.name}>{label}</label>
      <div>
        <input className="form-control" {...input} placeholder={label} type={type} />
        {touched && (error && <span>{error}</span>)}
      </div>
    </div>
  )

const CreateTheorem = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
          <Field
            name="if"
            label="If"
            component={ps => <Labeled {...ps} Component={FormulaInput} />}
          />
          <Field
            name="then"
            label="Then"
            component={ps => <Labeled {...ps} Component={FormulaInput} />}
          />
          <Field
            name="description"
            label="Description"
            component={renderField}
          />
          <button className="btn btn-default" type="submit" disabled={submitting}>
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default connect(
  () => ({
    initialValues: { uid: uuid() }
  }),
  (dispatch, ownProps) => ({
    onSubmit: (theorem) => {
      dispatch(addTheorem(theorem))
      ownProps.history.push(`/theorems/${theorem.uid}`)
    }
  })
)(
  reduxForm({
    form: 'createTheorem',
    validate
  })
    (CreateTheorem))