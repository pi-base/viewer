import * as React from 'react'
import { Field, FieldArray } from 'redux-form'

import { updateSpace } from '../../actions'
import { Id, Space, State, Citation } from '../../types'

import Detail from './Detail'
import { Text, Textarea } from '../Form/Labeled'

import form from '../Form'

type Values = {
  uid: Id
  name: string
  description: string
  references: Citation[]
}
type Errors = {
  name?: string
}

const Citation = props => {
  return (
    <div>
      <h4>Citations</h4>
      {props.fields.map((citation, index) => (
        <div key={index}>
          <Field name={`${citation}.type`} component={Text} label="Type" />
          <Field name={`${citation}.ref`} component={Text} label="Ref" />
          <Field name={`${citation}.name`} component={Text} label="Name" />
          <button className="btn btn-danger btn-sm" onClick={() => props.fields.remove(index)}>
            Remove
          </button>
          <hr />
        </div>
      ))}
      <button type="button" className="btn btn-default btn-sm" onClick={() => props.fields.push({})}>
        Add Reference
      </button>
    </div>
  )
}

// FIXME: share form between create and edit
const Edit = props => {
  const { handleSubmit, submitting, valid, getResult } = props
  const space = getResult()

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
          <FieldArray name="references" component={Citation} />
          <button className="btn btn-default" type="submit" disabled={submitting}>
            Save
          </button>
        </form>
      </div>

      <div className="col-sm-6">
        {space ? <Detail {...props} space={space} editPreview={true} /> : ''}
      </div>
    </div>
  )
}

const build = (state: State, values: Values) => {
  const errors: Errors = {}
  if (!values.name) { errors.name = 'Required' }

  const result: Space = { ...values }
  return { result, errors }
}

const save = (dispatch, ownProps, space) => {
  dispatch(updateSpace(space))
  ownProps.history.push(`/spaces/${space.uid}`)
}

const initial = (state: State, ownProps) => {
  const space = state.spaces.get(ownProps.match.params.spaceId)
  const { uid, name, description, references } = space! // FIXME - what if we fail to find?
  return { uid, name, description, references }
}

export default form<Space, Values>({
  build,
  initial,
  name: 'updateSpace',
  fields: ['name', 'description', 'references'],
  save
})(Edit)