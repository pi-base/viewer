import * as React from 'react'

import { Citation } from '../../types'
import { CitationType } from '../../types'
import { Field } from 'redux-form'
import Icon from '../Icon'
import { Map } from 'immutable'

const citationTypes: Map<CitationType, string> = Map([
  ['doi', 'DOI'],
  ['mr', 'Math Reviews'],
  ['wiki', 'Wikipedia']
])

const Citation = ({ name, onRemove }) => {
  return (
    <div>
      <div className="form-group row">
        <div className="col-sm-2">
          <Field
            name={`${name}.type`}
            className="form-control"
            component="select"
          >
            <option />
            {citationTypes.map((label, key) => (
              <option key={key} value={key}>{label}</option>
            )).toList()}
          </Field>
        </div>
        <div className="col-sm-4">
          <Field
            name={`${name}.ref`}
            className="form-control"
            component="input"
            placeholder="Reference"
          />
        </div>
        <div className="col-sm-5">
          <Field
            name={`${name}.name`}
            className="form-control"
            component="input"
            placeholder="Description"
          />
        </div>
        <div className="col-sm-1">
          <button className="btn btn-default btn-xs" onClick={onRemove}>
            <Icon type="remove" />
          </button>
        </div>
      </div>
    </div>
  )
}

const Citations = (props) => {
  const { fields } = props
  return (
    <div className="form-group">
      <label>
        Citations
        {' '}
        <button type="button" className="btn btn-default btn-xs" onClick={() => fields.push({})}>
          Add
        </button>
      </label>
      {fields.map((citation, index) => (
        <Citation key={index} name={citation} onRemove={() => fields.remove(index)} />
      ))}
    </div>
  )
}

export default Citations