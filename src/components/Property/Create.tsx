import * as React from 'react'
import { Field } from 'redux-form'
import uuid from 'uuid/v4'

import { createProperty } from '../../actions'
import { Id, Property, State } from '../../types'

import Detail from './Detail'
import { Citations, Text, Textarea } from '../Form/Labeled'

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
  const property = getResult()

  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
          <Field
            name="name"
            label="Name"
            component={Text}
          />
          <Field
            name="description"
            label="Description"
            component={Textarea}
          />
          <Field
            name="references"
            label="References"
            component={Citations}
          />
          <button className="btn btn-default" type="submit" disabled={submitting}>
            Save
          </button>
        </form>
      </div>

      <div className="col-sm-6">
        {property ? <Detail property={property} /> : ''}
      </div>
    </div>
  )
}

const build = (state: State, values: Values) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  const result: Property = { ...values, references: [] }
  return { result, errors }
}

const save = (dispatch, ownProps, property) => {
  dispatch(createProperty(property))
  ownProps.history.push(`/properties/${property.uid}`)
}

export default form<Property, Values>({
  build,
  initial: () => ({ uid: 'p' + uuid(), name: '', description: '' }),
  name: 'createProperty',
  fields: ['name', 'description'],
  save
})(Create)