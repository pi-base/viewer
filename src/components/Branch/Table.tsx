import * as A from '../../actions'
import * as React from 'react'

import { Branch, Dispatch, State } from '../../types'

import { by } from '../../utils'
import { connect } from 'react-redux'

type BranchExtra = Branch & { active: boolean }
type StateProps = {
  branches: BranchExtra[]
}
type DispatchProps = {
  changeBranch: (branch: Branch) => void
  submitBranch: (branch: Branch) => void
}
type Props = StateProps & DispatchProps

const BranchSubmit = ({ branch, submitBranch }: { branch: Branch, submitBranch: (b: Branch) => void }) => {
  const { active, access, submitting, pullRequestUrl } = branch

  if (access !== 'admin') { return null }

  if (pullRequestUrl) {
    return <a href={pullRequestUrl}>View pull request</a>
  } else {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => submitBranch(branch)}
        disabled={submitting}
      >
        Submit for Review
      </button>
    )
  }
}

const Branches = ({ branches, changeBranch, submitBranch }: Props) => {
  if (!branches) { return null }

  return (
    <table className="table table-condensed">
      <thead>
        <tr>
          <th />
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {branches.map(branch => (
          <tr key={branch.name}>
            <td>
              {branch.active
                ? <button className="btn btn-default" disabled={true}>Current</button>
                : <button className="btn btn-default" onClick={() => changeBranch(branch)}>Switch</button>
              }
            </td>
            <td>{branch.name}</td>
            <td>
              <BranchSubmit branch={branch} submitBranch={submitBranch} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default connect<StateProps, DispatchProps, {}, State>(
  state => {
    if (state.user === 'unauthenticated') {
      return { branches: [] }
    } else {
      const branches = Array.from(state.version.branches.values()).sort(by('name'))
      return {
        branches: branches.map(branch => ({
          ...branch,
          active: branch.name === state.version.active
        }))
      }
    }
  },
  (dispatch: Dispatch) => ({
    changeBranch: (branch) => dispatch(A.changeBranch(branch.name)),
    submitBranch: (branch) => dispatch(A.submitBranch(branch))
  })
)(Branches)