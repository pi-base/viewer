import React from 'react'
import { Link } from 'react-router'

const Navbar = () => (
  <nav className="navbar navbar-default navbar-static-top">
    <div className="container">
      <a className="navbar-brand">Pi-Base</a>
      <ul className="nav navbar-nav">
        <li><Link to="/spaces">Spaces</Link></li>
        <li><Link to="/search">Search</Link></li>
      </ul>
    </div>
  </nav>
)

export default Navbar
