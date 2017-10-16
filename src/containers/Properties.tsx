import * as React from 'react'
import { graphql, gql } from 'react-apollo'
import * as I from 'immutable'

import { view, updateView, createProperty } from '../graph'

const query = gql`
  query Properties {
    viewer {
      properties {
        uid
        name
        description
      }
    }
  }
`
class Container extends React.Component<any, {}> {
  render() {
    if (this.props.data && this.props.data.viewer) {
      const properties = I.List(this.props.data.viewer.properties)
      return (
        <div>
          {React.cloneElement(this.props.children, { properties: properties })}
        </div>
      )
    }
    return null
  }

}
export default graphql(query)(Container)