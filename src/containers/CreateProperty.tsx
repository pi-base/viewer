import * as React from 'react'
import { graphql } from 'react-apollo'

import { createProperty } from '../graph/queries'

class CreateProperty extends React.Component<any, {}> {
    save() {
        this.props.mutate({
            variables: {
                input: {
                    name: 'New Property',
                    description: 'New property description',
                }
            }
        })
    }

    render() {
        return (
            <div>
                <button className="btn btn-default" onClick={this.save.bind(this)}>Save</button>
            </div>
        )
    }
}
export default graphql(createProperty)(CreateProperty)