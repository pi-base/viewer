import * as React from 'react'
import * as S from '../../selectors'

import { Link, LinkProps } from 'react-router-dom'

import { State } from '../../types'
import { connect } from 'react-redux'

type StateProps = { editing: boolean }
type OwnProps = LinkProps
type Props = StateProps & OwnProps

const EditLink = (props: Props) => {
  const { editing, ...newProps } = props
  if (!editing) { return null }
  return <Link {...newProps} />
}

export default connect<StateProps, {}, OwnProps, State>(
  (state) => ({
    editing: S.editing(state)
  }),
  () => ({})
)(EditLink)