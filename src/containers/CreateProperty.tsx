import * as React from 'react'

import Form from '../components/Property/Form'

import { updateView } from '../graph'
import { createProperty } from '../graph/queries'

const CreateProperty = ({ update, router }) => {
    const create = (property) => {
        update({
            variables: {
                input: {
                    name: property.name,
                    description: property.description
                }
            }
        }).then(view => {
            // TODO: handle validation / server errors
            const prop = view.properties[0]
            router.push(`/properties/${prop.uid}`)
        })
    }

    return <Form save={create} />
}

export default updateView(createProperty)(CreateProperty)