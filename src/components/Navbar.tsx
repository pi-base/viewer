import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

import UserTab from './Layout/UserTab'

const Navbar = () => (
  <nav className="navbar navbar-default navbar-static-top">
    <div className="container">
      <Link to="/" className="navbar-brand">π-Base</Link>
      <ul className="nav navbar-nav">
        <li><NavLink activeClassName="active" to="/spaces">Spaces</NavLink></li>
        <li><NavLink activeClassName="active" to="/properties">Properties</NavLink></li>
        <li><NavLink activeClassName="active" to="/theorems">Theorems</NavLink></li>
      </ul>

      <ul className="nav navbar-nav pull-right">
        <li><NavLink activeClassName="active" to="/about">About</NavLink></li>
        <UserTab />
      </ul>
    </div>
  </nav>
)

export default Navbar
