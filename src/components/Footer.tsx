import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

let refresh = (e) => {
  e.preventDefault();
  localStorage.clear();
  location.reload();
}

const Footer = () => (
  <div className="row">
    <div className="col-xs-12">
      <hr/>
      Having trouble? Try{' '}
      <a
        href="#"
        onClick={refresh}>
        refreshing your cache
      </a>.
    </div>
  </div>
)

export default Footer
