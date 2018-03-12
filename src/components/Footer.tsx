import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

// N.B. this does _not_ clear the login token out of localStorage
const refreshRedux = (e) => {
  e.preventDefault()
  localStorage.removeItem('redux')
  location.reload()
}

const clearStorage = (e) => {
  e.preventDefault()
  localStorage.clear()
  location.reload()
}

const Footer = () => (
  <nav className="navbar navbar-inverse footer">
    <div className="container">
      <ul className="nav navbar-nav">
        <li><a href="#" onClick={refreshRedux}>Refresh redux</a></li>
        <li><a href="#" onClick={clearStorage}>Clear localStorage</a></li>
      </ul>
    </div>
  </nav>
)

export default Footer
