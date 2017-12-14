import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { State } from '../reducers'

import UserTab from './Layout/UserTab'
import BranchSelect from './Form/BranchSelect'

const NavbarStyle = (branch) => {
  if (branch === 'user') {
    return ('navbar navbar-static-top navbar-inverse')
  } else {
    return ('navbar navbar-static-top navbar-default')
  }
}

const Navbar = ({branch}) => (
  <nav className={NavbarStyle(branch)}>
    <div className="container">
      <Link to="/" className="navbar-brand">pi-Base</Link>
      <ul className="nav navbar-nav">
        <li><NavLink activeClassName="active" to="/spaces">Spaces</NavLink></li>
        <li><NavLink activeClassName="active" to="/properties">Properties</NavLink></li>
        <li><NavLink activeClassName="active" to="/theorems">Theorems</NavLink></li>
      </ul>

      <ul className="nav navbar-nav pull-right">
        <li><NavLink activeClassName="active" to="/about">About</NavLink></li>
        <BranchSelect />
        <UserTab />
      </ul>
    </div>
  </nav>
)

export default connect(
  (state: State) => ({
    branch: state.version.branch
  })
)(Navbar)
