import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Filter  from '../Filter'
import Preview from '../Preview'
import Tex     from '../Tex'

class Spaces extends React.Component {
  constructor() {
    super()
    this.state = {
      limit: 10,
      spaces: []
    }
  }

  componentWillMount() {
    this.doFilter(this.props.spaces)
  }

  more() {
    this.setState({ limit: this.state.limit + 10 })
  }

  doFilter(spaces) {
    this.setState({
      limit: 10,
      spaces: spaces.length ? spaces : this.props.spaces
    })
  }

  render() {
    const spaces = this.state.spaces.slice(0, this.state.limit)

    // TODO: the filter here may be confusing, should
    //   probably support searching by formula as well
    // TODO: add "infinite" scroll for paging
    return (
      <section className="spaces">
        <Filter
          collection={this.props.spaces}
          onChange={this.doFilter.bind(this)}
          placeholder="Filter spaces"
        />

        {spaces.map(space =>
          <Tex key={space.uid}>
            <h3>
              <Link to={`/spaces/${space.name}`}>
                {space.name}
              </Link>
            </h3>
            <Preview text={space.description}/>
          </Tex>
        )}

        { this.props.spaces.length > this.state.limit
        ? <button className="btn btn-default" onClick={() => this.more()}>Show More</button>
        : ''}
      </section>
    )
  }
}

export default connect(
  (state) => ({
    spaces: Q.allSpaces(state).toJS()
  })
)(Spaces)
