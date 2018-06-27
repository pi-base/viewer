import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import uuid from 'uuid/v4'

import { assertTrait, checkProofs } from '../../actions'
import * as S from '../../selectors'
import { Dispatch, Id, Property, Space, State, Trait } from '../../types'
import { by } from '../../utils'

import Labeled, { Textarea } from '../Form/Labeled'

type Values = {
  uid: string
  propertyId?: string
  value?: string
  description?: string
}
type Errors = {
  propertyId?: string
  value?: string
}

type OwnProps = {
  space: Space
}
type StateProps = {
  initialValues: Values
  findProperty: (id: Id) => Property | undefined
  unknownProperties: Property[]
}
type DispatchProps = {
  save: (trait: Trait) => void
}
type Props = OwnProps & StateProps & DispatchProps & RouteComponentProps<{}>

const validate = (values: Values): Errors => {
  const errors: Errors = {}
  if (!values.propertyId) {
    errors.propertyId = 'Required'
  }
  if (values.value === undefined) {
    errors.value = 'Required'
  }
  return errors
}

const build = (props: Props, values: Values): Trait | undefined => {
  const errors = validate(values)
  if (errors && Object.keys(errors).length > 0) { return }

  const property = props.findProperty(values.propertyId!)
  if (!property) { return }

  return {
    uid: values.uid,
    space: props.space,
    property: property,
    description: values.description,
    value: values.value! === 'true',
    deduced: false
  }
}

const PropertySelect = list => props => (
  <Labeled {...props} Component="select">
    <option />
    {list.sort(by('name')).map(p => (
      <option key={p.uid} value={p.uid}>{p.name}</option>
    ))}
  </Labeled>
)
const ValueSelect = props => (
  <Labeled {...props} Component="select">
    <option value="true">True</option>
    <option value="false">False</option>
  </Labeled>
)

const Create = props => {
  const { handleSubmit, submitting, unknownProperties } = props

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="propertyId"
        label="Property"
        component={PropertySelect(unknownProperties)}
      />
      <Field name="value" label="Value" component={ValueSelect} />
      <Field name="description" label="Description" component={Textarea} />
      <button className="btn btn-default" type="submit" disabled={submitting}>
        Save
      </button>
    </form>
  )
}

export default connect<StateProps, DispatchProps, OwnProps>(
  (state: State, ownProps: OwnProps): StateProps => ({
    initialValues: { uid: uuid(), value: 'true' },
    findProperty: (id) => state.properties.get(id),
    unknownProperties: S.unknownProperties(state, ownProps.space)
  }),
  (dispatch: Dispatch, ownProps: Props): DispatchProps => ({
    save: trait => {
      dispatch(assertTrait(trait))
      dispatch(checkProofs([trait.space]))
      ownProps.history.push(`/spaces/${ownProps.space.uid}/properties/${trait.property.uid}`)
    }
  })
)(
  reduxForm({
    form: 'createTrait',
    validate,
    onSubmit: (values: Values, dispatch: Dispatch, props: Props) => {
      const trait = build(props, values)
      if (trait) {
        props.save(trait)
      }
    }
  })(Create))