import * as React from 'react'
import * as S from '../../selectors'

import { Property, Space, State, Trait } from '../../types'
import { assertTrait, checkProofs } from '../../actions'

import { Fields as EditFields } from './Edit'
import { Field } from 'redux-form'
import Labeled from '../Form/Labeled'
import TraitForm from './Form'
import { by } from '../../utils'
import { connect } from 'react-redux'

type OwnProps = {
  space: Space
}
type StateProps = {
  unknownProperties: Property[]
}
type DispatchProps = {
  save: (trait: Trait) => void
}

const PropertySelect = props => (
  <Labeled {...props} Component="select">
    <option />
    {props.unknownProperties.sort(by('name')).map(p => (
      <option key={p.uid} value={p.uid}>{p.name}</option>
    ))}
  </Labeled>
)

const ValueSelect = props => (
  <Labeled {...props} Component="select">
    <option key="true" value="true">True</option>
    <option key="false" value="false">False</option>
  </Labeled>
)

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => ({
  unknownProperties: S.unknownProperties(state, ownProps.space)
})

const Fields = ({ unknownProperties }) => (
  <>
    <Field
      name="propertyId"
      label="Property"
      component={PropertySelect}
      unknownProperties={unknownProperties}
    />
    <Field name="value" label="Value" component={ValueSelect} />
    <EditFields />
  </>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  save: result => {
    dispatch(assertTrait(result)).then(trait => {
      ownProps.history.push(`/spaces/${ownProps.space.uid}/properties/${trait.property.uid}`)
      dispatch(checkProofs([trait.space]))
    })
  }
})

const Create = props => <TraitForm {...props} Fields={Fields} />

export default connect<{}, DispatchProps, OwnProps, State>(
  mapStateToProps,
  mapDispatchToProps
)(Create)