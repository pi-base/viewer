import * as React from 'react'
import { connect } from 'react-redux'

import Detail from './Detail'
import { Text, Textarea } from '../Form/Labeled'

import form from '../Form'
import { Link } from 'react-router-dom'

const Compare = () => {
  return (
    <div className="container">
      <h2>Compare spaces</h2>
      <div className="row">
        <div className="col-sm-3">
          <select className="form-control">
            <option>Select a space to compare...</option>
          </select>
          <p className='text-center'>
            <Link to='/spaces/S000091'>Space detail</Link>
          </p>
        </div>
        <div className="col-sm-3">
          <select className="form-control">
            <option>Select a space to compare...</option>
          </select>
          <p className='text-center'>
            <Link to='/spaces/S000091'>Space detail</Link>
          </p>
        </div>
        <div className="col-sm-3">
          <select className="form-control">
            <option>Select a space to compare...</option>
          </select>
          <p className='text-center'>
            <Link to='/spaces/S000091'>Space detail</Link>
          </p>
        </div>
        <div className="col-sm-3">
          <select className="form-control">
            <option>Select a space to compare...</option>
          </select>
          <p className='text-center'>
            <Link to='/spaces/S000091'>Space detail</Link>
          </p>
        </div>
      </div>
      <h3>Shared Traits</h3>
      <input className="form-control"
             type="text"
             placeholder="Filter properties by name"
      />
      <ul>
        <li><Link to='/properties/P000003'>Semiregular</Link></li>
        <li><Link to='/properties/P000003'>Paracompact</Link></li>
      </ul>
    </div>
  )
}

export default Compare
