import * as React from 'react'
import { graphql } from 'react-apollo'

import { createSpace } from '../graph/queries'

interface Props {
    space?: { name: string, description: string }
    save: (space: State) => void
}

interface State {
    name: string
    description: string
}

class SpaceForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        if (props.space) {
            this.state = props.space
        } else {
            this.state = { name: '', description: '' }
        }
    }

    save(e: any) {
        e.preventDefault()
        return this.props.save(this.state)
    }

    render() {
        return (
            <form onSubmit={(e) => this.save(e)}>
                <input
                    name="name"
                    placeholder="Name"
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={this.state.description}
                    onChange={(e) => this.setState({ description: e.target.value })}
                />
                <button>Save</button>
            </form >
        )
    }
}

const updateViewer = (query) => (component) => {
    return graphql(query)(component)
}

const CreateSpace = ({ mutate, updateVersion, router }) => {
    const save = ({ name, description }) => {
        return mutate({
            variables: {
                input: {
                    name: name,
                    description: description
                }
            }
        }).then(response => {
            const data = response.data.createSpace
            updateVersion(data.version)
            const space = data.spaces[0]
            router.push(`spaces/${space.uid}`)
        })
    }

    return (
        <SpaceForm save={save} />
    )
}

export default updateViewer(createSpace)(CreateSpace)
