import * as React from 'react'
import * as S from '../selectors'

import { Link, NavLink } from 'react-router-dom'

import { State } from '../types'
import UserTab from './Layout/UserTab'
import { connect } from 'react-redux'

type StateProps = { editing: boolean }
type Props = StateProps

const Navbar = ({ editing }: Props) => (
  <nav className={`navbar navbar-${editing ? 'inverse' : 'default'} navbar-static-top`}>
    <div className="container">
      <Link to="/" className="navbar-brand">π-Base</Link>
      <ul className="nav navbar-nav">
        <li><NavLink activeClassName="active" to="/spaces">Spaces</NavLink></li>
        <li><NavLink activeClassName="active" to="/properties">Properties</NavLink></li>
        <li><NavLink activeClassName="active" to="/theorems">Theorems</NavLink></li>
      </ul>

      <UserTab />
    </div>
  </nav>
)

export default connect<StateProps, {}, {}, State>(
  state => ({
    editing: S.editing(state)
  })
)(Navbar)
