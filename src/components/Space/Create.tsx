import * as React from 'react'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import { addSpace } from '../../actions'
import { Id, State } from '../../types'

import Detail from './Detail'
import Labeled from '../Form/Labeled'

type Values = {
  uid: Id
  name: string
  description: string
}
type Errors = {
  name?: string
}
const validate = (values: Values) => {
  const errors: Errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  return errors
}

const Text = props => <Labeled {...props} Component="input" />
const Textarea = props => <Labeled {...props} Component="textarea" />

const Create = props => {
  const { handleSubmit, pristine, reset, submitting, valid, space } = props

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

      <div className="col-sm-6">
        {valid
          ? <Detail space={space} />
          : ''
        }
      </div>
    </div>
  )
}

const selector = formValueSelector('createSpace')

export default connect(
  (state: State) => {
    return {
      initialValues: { uid: uuid() },
      space: selector(state, 'name', 'description')
    }
  },
  (dispatch, ownProps) => ({
    onSubmit: (space: Values) => {
      dispatch(addSpace(space))
      ownProps.history.push(`/spaces/${space.uid}`)
    }
  })
)(
  reduxForm({
    form: 'createSpace',
    validate
  })
    (Create))