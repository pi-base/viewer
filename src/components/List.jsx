import React, { PropTypes } from 'react'

import Filter from './Filter'

class List extends React.Component {
  constructor() {
    super()
    this.state = {
      limit: 25,
      objects: []
    }
  }

  componentWillMount() {
    this.doFilter(this.props.objects)
  }

  more() {
    this.setState({ limit: this.state.limit + 25 })
  }

  doFilter(objects) {
    this.setState({
      limit: 25,
      objects: objects.length ? objects : this.props.objects
    })
  }

  render() {
    const objects = this.state.objects.slice(0, this.state.limit)

    // TODO: the filter here may be confusing, should
    //   probably support searching by formula as well
    // TODO: add "infinite" scroll for paging
    return (
      <section className={this.props.name}>
        <Filter
          collection={this.props.objects}
          onChange={this.doFilter.bind(this)}
          placeholder={`Filter ${this.props.name}`}
        />

      {objects.map(obj => <this.props.component key={obj.uid} object={obj}/>)}

        { this.props.objects.length > this.state.limit
        ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
        : ''}
      </section>
    )
  }
}

List.propTypes = {
  name: PropTypes.string.isRequired,
  objects: PropTypes.array.isRequired,
  component: PropTypes.func.isRequired
}

export default List
