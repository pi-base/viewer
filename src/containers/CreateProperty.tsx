import * as React from 'react'
import { graphql } from 'react-apollo'

import { createProperty } from '../graph/queries'

const CreateProperty = ({ mutate }) => {
    const save = () => {
        mutate({
            variables: {
                input: {
                    name: 'New Property',
                    description: 'New property description',
                }
            }
        })
    }

    return (
        <div>
            <button className="btn btn-default" onClick={save}>Save</button>
        </div>
    )
}

export default graphql(createProperty)(CreateProperty)