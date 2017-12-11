import * as React from 'react'

import { Finder, Record, Weights } from '../models/Finder'

export interface Props {
  collection: Record[]
  weights?: Weights
  onChange: (results: Record[]) => void
  name?: string
  placeholder?: string
}

export interface State {
  q: string
}

class Filter extends React.Component<Props, State> {
  finder: Finder<Record>

  constructor(props: Props) {
    super(props)
    this.state = { q: '' }
  }

  componentWillMount() {
    const weights = this.props.weights || [
      { name: 'name', weight: 0.7 },
      { name: 'aliases', weight: 0.6 },
      { name: 'description', weight: 0.3 }
    ]
    this.finder = new Finder(this.props.collection, weights)
  }

  onChange(q: string) {
    this.setState({ q })
    if (!q) { return this.props.onChange([]) }

    this.props.onChange(this.finder.search(q))
  }

  render() {
    const { name = 'filter', placeholder = 'Filter' } = this.props

    return (
      <input
        type="text"
        autoComplete="off"
        className="form-control"
        name={name}
        placeholder={placeholder}
        value={this.state.q}
        onChange={e => this.onChange(e.target.value)}
      />
    )
  }
}

export default Filter
