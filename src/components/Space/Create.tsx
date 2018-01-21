import * as React from 'react'
import { connect } from 'react-redux'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import { createSpace } from '../../actions'
import { Id, Space, State } from '../../types'

import Detail from './Detail'
import { Text, Textarea } from '../Form/Labeled'

import form from '../Form'

type Values = {
  uid: Id
  name: string
  description: string
}
type Errors = {
  name?: string
}

const Create = props => {
  const { handleSubmit, submitting, valid, getResult } = props
  const space = getResult()

  return (
    <div className="container">
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
          {space ? <Detail space={space} /> : ''}
        </div>
      </div>
    </div>
  )
}

const build = (state: State, values: Values) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  const result: Space = values
  return { result, errors }
}

const save = (dispatch, ownProps, space) => {
  dispatch(createSpace(space))
  ownProps.history.push(`/spaces/${space.uid}`)
}

export default form<Space, Values>({
  build,
  initial: () => ({ uid: 's' + uuid(), name: '', description: '' }),
  name: 'createSpace',
  fields: ['name', 'description'],
  save
})(Create)
