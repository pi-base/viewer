import React from 'react'
import { Link } from 'react-router'

const Navbar = () => (
  <nav className="navbar navbar-default navbar-static-top">
    <div className="container">
      <Link to="/" className="navbar-brand">π-Base</Link>
      <ul className="nav navbar-nav">
        <li><Link activeClassName="active" to="/spaces">Spaces</Link></li>
        <li><Link activeClassName="active" to="/properties">Properties</Link></li>
      </ul>
    </div>
  </nav>
)

export default Navbar
