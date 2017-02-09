import React from 'react'
import Relay from 'react-relay'

import TraitPager from './Trait/Pager'
import Tex        from './Tex'

class Space extends React.Component {
  render() {
    const { space } = this.props
    // TODO: (why) can this happen?
    if (!space) { return null }

    return (
      <div>
        <h1>{space.name}</h1>
        <Tex>{space.description}</Tex>

        <hr/>

        <div className="row">
          <div className="col-md-4">
            <TraitPager space={space}/>
          </div>
          <div className="col-md-8">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Relay.createContainer(Space, {
  fragments: {
    space: () => Relay.QL`
      fragment on Space {
        uid
        name
        description
      }
    `
  }
})
