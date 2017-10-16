import * as React from 'react'

class Form extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        if (props.property) {
            this.state = props.property
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

export default Form