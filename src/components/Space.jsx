import React from 'react'
import Relay from 'react-relay'

import Markdown   from './Markdown'
import TraitPager from './Trait/Pager'
import Tex        from './Tex'

class Space extends React.Component {
  render() {
    const space = this.props.viewer.spaces[0]

    return (
      <div>
        <h1>{space.name}</h1>
        <Tex><Markdown text={space.description}/></Tex>

        <hr/>

        <div className="row">
          <div className="col-md-4">
            <h3>Properties</h3>
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
  initialVariables: {
    uid: '1'
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        spaces(uid: $uid) {
          uid
          name
          description
        }
      }
    `
  }
})
