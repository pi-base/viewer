import * as React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import Tex from '../Tex'

@observer
class Form extends React.Component<any, any> {
  @observable name: string
  @observable description: string

  constructor(props: any) {
    super(props)
    if (props.property) {
      this.name = props.property.name
      this.description = props.property.description
    } else {
      this.name = ''
      this.description = ''
    }
  }

  save(e: any) {
    e.preventDefault()
    return this.props.save({
      name: this.name,
      description: this.description
    })
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={(e) => this.save(e)}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                name="name"
                value={this.name}
                onChange={e => this.name = e.target.value}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={this.description}
                onChange={e => this.description = e.target.value}
                className="form-control"
                rows={10}
              />
            </div>
            <button className="btn btn-primary">Save</button>
          </form >
        </div>

        <div className="col-md-6">
          <h3>{this.name || ' '}</h3>
          <Tex>{this.description}</Tex>
        </div>
      </div>
    )
  }
}

export default Form