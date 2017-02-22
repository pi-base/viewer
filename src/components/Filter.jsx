import React, { PropTypes } from 'react'
import Fuse  from 'fuse.js'

import * as I from 'immutable'

class Filter extends React.Component {
  constructor() {
    super()
    this.state = { q: '' }
  }

  componentWillMount() {
    this.records = {}

    this.props.collection.forEach((rec, i) => {
      this.records[rec.get('uid')] = rec
    })

    this.finder = new Fuse(this.props.collection.toJS(), {
      caseSensitive: false,
      shouldSort: true,
      keys: this.props.weights,
      id: 'uid',
      threshold: 0.5
    })
  }

  onChange(q) {
    this.setState({ q })
    if (!q) { return this.props.onChange([]) }

    const matches = I.List(this.finder
      .search(q)
      .map(uid => this.records[uid]))

    this.props.onChange(matches)
  }

  render() {
    const { name, placeholder } = this.props

    return <input
      type="text"
      autoComplete="off"
      className="form-control"
      name={name}
      placeholder={placeholder}
      value={this.state.q}
      onChange={(e) => this.onChange(e.target.value)}
    />
  }
}

Filter.propTypes = {
  collection:  PropTypes.instanceOf(I.List).isRequired,
  onChange:    PropTypes.func.isRequired,
  weights:     PropTypes.array,
  name:        PropTypes.string,
  placeholder: PropTypes.string
}

const weights = [{
  name: 'name',
  weight: 0.7
},{
  name: 'description',
  weight: 0.3
}]
Filter.defaultProps = {
  weights:     weights,
  name:        'filter',
  placeholder: 'Filter'
}

export default Filter
