import React from 'react'
import Fuse  from 'fuse.js'

// TODO: extract Fuse
class Filter extends React.Component {
  constructor() {
    super()
    this.state = { q: '' }
  }

  componentWillMount() {
    this.records = {}
    const records = []

    this.props.collection.forEach((rec, i) => {
      const name = this.props.onField(rec)

      this.records[i] = rec
      records.push({ id: i, name: name })
    })

    this.finder = new Fuse(records, {
      caseSensitive: false,
      shouldSort: true,
      keys: ['name'],
      id: 'id',
      threshold: 0.7
    })
  }

  onChange(q) {
    this.setState({ q })

    const matches = this.finder
      .search(q)
      .map(id => this.records[id])

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
  collection:  React.PropTypes.object.isRequired,
  onField:     React.PropTypes.func.isRequired,
  onChange:    React.PropTypes.func.isRequired,
  name:        React.PropTypes.string,
  placeholder: React.PropTypes.string
}

Filter.defaultProps = {
  name:        'filter',
  placeholder: 'Filter'
}

export default Filter
