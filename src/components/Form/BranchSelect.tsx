import * as React from 'react'
import { connect } from 'react-redux'

import { State } from '../../reducers'
import * as A from '../../actions'

const BranchSelect = ({ branch, changeBranch }) => {
  let preventDefaultAndChangeBranch = (theBranch) => {
    return (e) => {
      e.preventDefault();
      changeBranch(theBranch);
    }
  }
  if (branch === 'user') {
    return (
      <li className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          User Branch <span className="caret" />
        </a>
        <ul className="dropdown-menu">
          <li>
            <a
              href="#"
              onClick={preventDefaultAndChangeBranch('audit')}
            >
              Swtich to master branch
            </a>
          </li>
        </ul>
      </li>
    )
  } else {
    return (
      <li className="dropdown">
        <a
          href="#"
          className="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Master Branch <span className="caret" />
        </a>
        <ul className="dropdown-menu">
          <li>
            <a
              href="#"
              onClick={preventDefaultAndChangeBranch('user')}
            >
              Swtich to user branch
            </a>
          </li>
        </ul>
      </li>
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
