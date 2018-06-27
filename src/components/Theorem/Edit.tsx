import * as React from 'react'
import { Field } from 'redux-form'

import { updateTheorem } from '../../actions'
import { Id, Theorem, State, Citation } from '../../types'

import Detail from './Detail'
import Citations from '../Citations'
import { Text, Textarea } from '../Form/Labeled'

import form from '../Form'

type Values = {
  uid: Id
  description: string
  references: Citation[]
}
type Errors = {
  name?: string
}

// FIXME: share form between create and edit
const Edit = props => {
  const { handleSubmit, submitting, valid, getResult } = props
  const theorem = getResult()

  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
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
          <div>
            <h3>Citations</h3>
          </div>
          <button className="btn btn-default" type="submit" disabled={submitting}>
            Save
          </button>
        </form>
      </div>

      <div className="col-sm-6">
        {theorem ? <Detail {...props} theorem={theorem} /> : ''}
      </div>
    </div>
  )
}

const build = (state: State, values: Values, props: any) => {
  const errors: Errors = {}

  const result: Theorem = { ...props.theorem, ...values }
  return { result, errors }
}

const save = (dispatch, ownProps, theorem) => {
  dispatch(updateTheorem(theorem))
  ownProps.history.push(`/theorems/${theorem.uid}`)
}

export default form<Theorem, Values>({
  build,
  initial: (_, { space }) => space,
  name: 'updateTheorem',
  fields: ['name', 'description'],
  save
})(Edit)