import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as S from '../../selectors'

const EditLink = (({ editing, to }) => {
  if (!editing) { return null }
  return <Link to={to}>Edit</Link>
})

export default connect(
  (state) => ({
    editing: S.editing(state)
  })
)(EditLink)