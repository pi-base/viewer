import * as React from 'react'

import uuid from 'uuid/v4'
import { mobxStore } from '../store'

import Form from '../components/Property/Form'

class CreateProperty extends React.Component<any, {}> {
    save: () => void

    constructor(props: any) {
        super(props);
        this.save = this._save.bind(this)
    }

    _save(p: any) {
        const q = {
            uid: uuid(),
            name: p.name,
            description: p.description
        }
        mobxStore.properties.add(q)
        this.props.router.push(`/properties/${q.uid}`)
    }

    render() {
        return <Form save={this.save} />
    }
}

export default CreateProperty