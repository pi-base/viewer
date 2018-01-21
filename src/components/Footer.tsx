import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

const refresh = (e) => {
  e.preventDefault()
  localStorage.removeItem('redux')
  location.reload()
}

const Footer = () => (
  <div className="container">
    <div className="row">
      <div className="col-xs-12">
        <hr />
        Having trouble? Try{' '}
        <a
          href="#"
          onClick={refresh}
        >
          refreshing your cache
        </a>.
      </div>
    </div>
  </div>
)

export default Footer
