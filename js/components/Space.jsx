import React from 'react'
import Relay from 'react-relay'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import Trait from './Trait'
import Tex   from './Tex'

const TraitItem = ({ trait }) => {
  const icon = trait.value == 'True' ? 'ok' : 'remove'

  return (
    <li>
      <i className={`glyphicon glyphicon-${icon}`}></i>
      <Link to={`/spaces/${trait.space.name}/properties/${trait.property.name}`}>
        {trait.property.name}
      </Link>
    </li>
  )
}

const debounce = (time, fn) => {
  let timeout

  // TODO: make variadic (or use util)
  return (arg) => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    timeout = setTimeout(function() {
      fn(arg)
    }, time)
  }
}

class _TraitPager extends React.Component {
  constructor() {
    super()
    this.state = { filter: '' }
  }

  doFilter(str) {
    this.setState({ filter: str })

    if (this.wait) {
      clearTimeout(this.wait)
      this.wait = null
    }
    this.wait = setTimeout(() => {
      this.props.relay.setVariables({ filter: str })
      this.wait = null
    }, 500)
  }

  nextPage() {
    console.log('next')
  }

  render() {
    const { traits } = this.props.space
    const { filter } = this.state

    return (
      <div>
        <input
          type         = "text"
          autoComplete = "off"
          className    = ""
          name         = "traitFilter"
          value        = {filter}
          onChange     = {(e) => this.doFilter(e.target.value)}
        />
        <ul>
          {traits.edges.map(edge =>
            <TraitItem key={edge.node.id} trait={edge.node}/>
          )}
        </ul>
        <button onClick={() => this.nextPage()} className="btn btn-default">Next</button>
      </div>
    )
  }
}

const TraitPager = Relay.createContainer(_TraitPager, {
  initialVariables: {
    after:  null,
    filter: null
  },
  fragments: {
    space: () => Relay.QL`
      fragment on Space {
        traits(first: 25, propertySearch: $filter, after: $after) {
          edges {
            cursor
            node {
              id
              value
              space {
                id
                name
              }
              property {
                id
                name
              }
            }
          }
        }
      }
    `
  }
})

class Space extends React.Component {
  nextPage() {
    const traits = this.props.space.traits.edges
    this.props.relay.setVariables({after: traits[traits.length - 1].cursor})
  }

  render() {
    // TODO: (why) can this happen?
    if (!this.props.space) { return null }

    const { name, description, traits } = this.props.space

    // traits={traits} showSpace={false} next={this.nextPage.bind(this)}/>
    return (
      <div>
        <h1>{name}</h1>
        <Tex>{description}</Tex>

        <div className="row">
          <div className="col-md-4">
            <TraitPager space={this.props.space}/>
          </div>
          <div className="col-md-8">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Space, {
  initialVariables: {
    after: null
  },
  fragments: {
    space: () => Relay.QL`
      fragment on Space {
        name
        description
        ${TraitPager.getFragment('space')}
      }
    `,
  },
});
