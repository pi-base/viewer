import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import { addTheorem } from '../../actions'
import { parseFormula } from '../../selectors'
import { Dispatch, State, Theorem } from '../../types'

import * as F from '../../models/Formula'
import Labeled from '../Form/Labeled'
import FormulaInput from '../Formula/Input'

type Values = {
  uid: string
  if?: string
  then?: string
  description?: string
}
type Errors = {
  if?: string
  then?: string
}

type StateProps = {
  initialValues: Values
  build: (values: Values) => Theorem | undefined
}
type DispatchProps = {
  save: (theorem: Theorem) => void
}
type Props = StateProps & DispatchProps & RouteComponentProps<{}>

const build = (state: State, values: Values): Theorem | undefined => {
  if (!values.if || !values.then) { return undefined }
  const antecedent = parseFormula(state, values.if)
  if (!antecedent) { return undefined }
  const consequent = parseFormula(state, values.then)
  if (!consequent) { return undefined }

  return {
    uid: values.uid,
    if: antecedent!,
    then: consequent!,
    description: values.description || ''
  }
}

const validate = (values: Values, props: Props) => {
  const errors: Errors = {}
  if (!values.if) {
    errors.if = 'Required'
  }
  if (!values.then) {
    errors.then = 'Required'
  }

  const theorem = props.build(values)
  console.log('Check theorem for counterexamples', theorem, values, errors)

  return errors
}

const Formula = props => <Labeled {...props} Component={FormulaInput} />
const Text = props => <Labeled {...props} Component="input" />

const CreateTheorem = props => {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <div className="row">
      <div className="col-sm-6">
        <form onSubmit={handleSubmit}>
          <Field
            name="if"
            label="If"
            component={Formula}
          />
          <Field
            name="then"
            label="Then"
            component={Formula}
          />
          <Field
            name="description"
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
  (state: State): StateProps => ({
    initialValues: { uid: uuid() },
    build: (values) => build(state, values)
  }),
  (dispatch: Dispatch, ownProps: Props): DispatchProps => ({
    save: theorem => {
      dispatch(addTheorem(theorem))
      dispatch({ type: 'CHECK_PROOFS' })
      ownProps.history.push(`/theorems/${theorem.uid}`)
    }
  })
)(
  reduxForm({
    form: 'createTheorem',
    validate,
    onSubmit: (values: Values, dispatch: Dispatch, props: Props) => {
      const theorem = props.build(values)
      if (theorem) { // TODO: this should always happen, if validation passed
        props.save(theorem)
      }
    }
  })
    (CreateTheorem))