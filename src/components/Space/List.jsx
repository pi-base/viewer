import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import * as Q from '../../queries'

import Icon    from '../Icon'
import List    from '../List'
import Preview from '../Preview'
import Tex     from '../Tex'

class SpacePreview extends React.Component {
  constructor() {
    super()
    this.state = { expanded: false }
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const space = this.props.object

    return (
      <Tex>
        <h3>
          <button
            className="btn btn-default btn-xs"
            onClick={this.toggle.bind(this)}
          >
            <Icon type="question-sign"/>
          </button>
          {' '}
          <Link to={`/spaces/${space.name}`}>
            {space.name}
          </Link>
        </h3>
        { this.state.expanded
        ? <Preview text={space.description}/>
        : ''}
      </Tex>
    )
  }
}

class Spaces extends React.Component {
  render() {
    return <List name="spaces" objects={this.props.spaces} component={SpacePreview}/>
  }
}

export default connect(
  (state) => ({
    spaces: Q.allSpaces(state).toJS()
  })
)(Spaces)
