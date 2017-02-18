import React from 'react'
import { Link } from 'react-router'

const Navbar = () => (
  <nav className="navbar navbar-default navbar-static-top">
    <div className="container">
      <a className="navbar-brand">Pi-Base</a>
      <ul className="nav navbar-nav">
        <li><Link activeClassName="active" to="/spaces">Spaces</Link></li>
        <li><Link activeClassName="active" to="/properties">Properties</Link></li>
        <li><Link activeClassName="active" to="/search">Search</Link></li>
      </ul>
    </div>
  </nav>
)

export default Navbar
