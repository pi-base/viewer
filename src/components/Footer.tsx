import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

const action = (name: string, ...args) => (e) => {
  e.preventDefault()
  if (!window.piBase) { return }
  window.piBase[name](...args)
}

const Footer = () => (
  <nav className="navbar navbar-inverse footer">
    <div className="container">
      <ul className="nav navbar-nav">
        <li><a href="#" onClick={action('refreshRedux')}>Refresh redux</a></li>
        <li><a href="#" onClick={action('clearStorage')}>Clear localStorage</a></li>
      </ul>
      <ul className="nav navbar-nav pull-right">
        <li><a href="#" onClick={action('clientError')}>Client error</a></li>
      </ul>
    </div>
  </nav>
)

export default Footer
