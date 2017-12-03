import * as React from 'react'
import { connect } from 'react-redux'

import { State } from '../../reducers'
import * as A from '../../actions'

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

export default connect(
  (state: State) => ({
    branch: state.version.branch
  }),
  (dispatch) => ({
    changeBranch: (name) => dispatch(A.changeBranch(name))
  })
)(BranchSelect)