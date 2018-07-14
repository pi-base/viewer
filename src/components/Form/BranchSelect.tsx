import * as A from '../../actions'
import * as React from 'react'

import { Branch, Dispatch, State, } from '../../types'

import { activeBranch } from '../../selectors'
import { connect } from 'react-redux'

const BranchSelect = ({ branch, changeBranch }) => {
  if (branch === 'user') {
    return (
      <div className="alert alert-info">
        <p>
          Currently viewing your personal branch.
          {' '}
          <a href="#" onClick={() => changeBranch('audit')}>
            Swtich to audited content
          </a>
          .
        </p>
      </div>
    )
  } else {
    return (
      <div className="alert alert-info">
        <p>
          Currently viewing only audited content.
          {' '}
          <a href="#" onClick={() => changeBranch('user')}>
            Swtich to your personal branch
          </a>
          {' '}
          to edit.
        </p>
      </div>
    )
  }
}

type StateProps = { branch: Branch | undefined }
type DispatchProps = { changeBranch: (name: string) => void }

export default connect<StateProps, DispatchProps, {}, State>(
  state => ({
    branch: activeBranch(state)
  }),
  (dispatch: Dispatch) => ({
    changeBranch: (name) => dispatch(A.changeBranch(name))
  })
)(BranchSelect)
