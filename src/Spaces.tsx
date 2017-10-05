import * as React from 'react'
import { graphql } from 'react-apollo'

import * as Q from './queries'

const Spaces = ({ viewer: { spaces } }: Q.SpacesResponse) => {
    return (
        <ul>
            {spaces.map(s =>
                <li key={s.uid}>{s.uid}: {s.name}</li>
            )}
        </ul>
    )
}

const loading = (component) => ({ data }) => {
    if (data.loading || !data) {
        return <p>Loading</p>
    }
    return component(data)
}

export default graphql<Q.SpacesResponse>(Q.spaces)(loading(Spaces))