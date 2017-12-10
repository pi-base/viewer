import * as React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import Labeled from '../Form/Labeled'
import { addProperty } from '../../actions'

type Errors = {
  name?: string
}
const validate = values => {
  const errors: Errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  return errors
}

const Text = props => <Labeled {...props} Component="input" />

const Create = props => {
  const { handleSubmit, pristine, reset, submitting } = props

  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            type="text"
            label="Name"
            component={Text}
          />
          <Field
            name="description"
            type="textarea"
            label="Description"
            component={Text}
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
    onSubmit: (property) => {
      dispatch(addProperty(property))
      ownProps.history.push(`/properties/${property.uid}`)
    }
  })
)(
  reduxForm({
    form: 'createProperty',
    validate
  })
    (Create))