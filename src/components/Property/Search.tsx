import * as React from 'react'
import { Link } from 'react-router'

import * as I from 'immutable'
import { observer } from 'mobx-react'

import { mobxStore } from '../../store'

import List from '../List'
import Preview from '../Preview'
import Tex from '../Tex'

interface Item {
  uid: string
  name: string
  description: string
}

interface Props {
  object: Item
}

class Property extends React.Component<Props, { expanded: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = { expanded: false }
  }

  toggle() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const property = this.props.object

    return (
      <Tex className="row">
        <div className="col-md-2">
          <h4>
            <Link to={`/properties/${property.uid}`}>
              {property.name}
            </Link>
          </h4>
        </div>
        <div className="col-md-10">
          <Preview text={property.description} />
        </div>
      </Tex>
    )
  }
}

@observer
class Search extends React.Component {
  render() {
    const properties = mobxStore.properties.all

    return (
      <div>
        <Link to="properties/new">New</Link>

        <List
          name="properties"
          objects={properties}
          component={Property}
        />
      </div>
    )
  }
}

export default Search