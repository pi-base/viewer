import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import { assertTheorem, checkProofs } from '../../actions'
import * as S from '../../selectors'
import { Dispatch, Space, State, Theorem } from '../../types'

import { Formula, Textarea } from '../Form/Labeled'
import Detail from './Detail'
import TraitTable from '../Trait/Table'

import form from '../Form'

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

const Preview = connect(
  (state, ownProps) => ({
    properties: S.theoremProperties(state, ownProps.theorem)
  })
)(({ theorem, properties }) => (
  <article>
    <Detail theorem={theorem} />
    <hr />
    {theorem.counterexamples.length > 0
      ?
      <div>
        <p>Found counterexamples:</p>
        <TraitTable spaces={theorem.counterexamples} properties={properties} />
      </div>
      : <p>No couterexamples found</p>
    }
  </article>
))

const Create = props => {
  const { handleSubmit, submitting, valid, getResult } = props
  const theorem = getResult()

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6">
          <form onSubmit={handleSubmit}>
            <Field
              name="if"
              label="If"
              placeholder="compact + t_2"
              component={Formula}
            />
            <Field
              name="then"
              label="Then"
              placeholder="t_4"
              component={Formula}
            />
            <Field
              name="description"
              label="Description"
              component={Textarea}
            />
            <button className="btn btn-default" type="submit" disabled={submitting}>
              Save
            </button>
          </form>
        </div>
        <div className="col-sm-6">
          {theorem ? <Preview theorem={theorem} /> : ''}
        </div>
      </div>
    </div>
  )
}

const build = (state: State, values: Values) => {
  const errors: Errors = {}
  if (!values.if) { errors.if = 'Required' }
  if (!values.then) { errors.then = 'Required' }
  if (!values.if || !values.then) { return { errors } }

  const antecedent = S.parseFormula(state, values.if)
  if (!antecedent) {
    errors.if = 'Could not be parsed'
    return { errors }
  }
  const consequent = S.parseFormula(state, values.then)
  if (!consequent) {
    errors.then = 'Could not be parsed'
    return { errors }
  }

  const result: Theorem & { counterexamples: Space[] } = {
    uid: values.uid,
    if: antecedent!,
    then: consequent!,
    description: values.description || '',
    counterexamples: []
  }

  result.counterexamples = S.counterexamples(state, result)
  if (result.counterexamples.length > 0) {
    errors.then = 'Has counterexamples'
  }

  return { result, errors }
}

const save = (dispatch, ownProps, theorem) => {
  dispatch(assertTheorem(theorem))
  dispatch(checkProofs())
  ownProps.history.push(`/theorems/${theorem.uid}`)
}

export default form<Theorem, Values>({
  build,
  initial: () => ({ uid: 't' + uuid() }),
  name: 'createTheorem',
  fields: ['if', 'then', 'description'],
  save
})(Create)
