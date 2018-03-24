import * as React from 'react'
import { connect } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'

import * as S from '../selectors'

import UserTab from './Layout/UserTab'

const Navbar = ({ editing }) => (
  <nav className={`navbar navbar-${editing ? 'inverse' : 'default'} navbar-static-top`}>
    <div className="container">
      <Link to="/" className="navbar-brand">pi-Base</Link>
      <ul className="nav navbar-nav">
        <li><NavLink activeClassName="active" to="/spaces">Spaces</NavLink></li>
        <li><NavLink activeClassName="active" to="/properties">Properties</NavLink></li>
        <li><NavLink activeClassName="active" to="/theorems">Theorems</NavLink></li>
      </ul>

      <ul className="nav navbar-nav pull-right">
        <UserTab />
      </ul>
    </div>
  </nav>
)

export default connect(
  (state) => ({
    editing: S.editing(state)
  })
)(Navbar)
