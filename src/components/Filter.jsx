import React from 'react'
import Fuse  from 'fuse.js'

class Filter extends React.Component {
  constructor() {
    super()
    this.state = { q: '' }
  }

  componentWillMount() {
    this.records = {}

    this.props.collection.forEach((rec, i) => {
      this.records[rec.uid] = rec
    })

    this.finder = new Fuse(this.props.collection, {
      caseSensitive: false,
      shouldSort: true,
      keys: this.props.weights,
      id: 'uid',
      threshold: 0.7
    })
  }

  onChange(q) {
    this.setState({ q })
    if (!q) { return this.props.onChange([]) }

    const matches = this.finder
      .search(q)
      .map(uid => this.records[uid])

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
  collection:  React.PropTypes.array.isRequired,
  onChange:    React.PropTypes.func.isRequired,
  weights:     React.PropTypes.array,
  name:        React.PropTypes.string,
  placeholder: React.PropTypes.string
}

const weights = [{
  name: 'name',
  weight: 0.6
},{
  name: 'description',
  weight: 0.4
}]
Filter.defaultProps = {
  weights:     weights,
  name:        'filter',
  placeholder: 'Filter'
}

export default Filter
