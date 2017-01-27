import React from 'react'
import { connect } from 'react-redux'

const State = connect(
    (state) => { return { state } }
)(({ state }) => {
    return (
        <pre>{JSON.stringify(state, null, 2)}</pre>
    )
})

class App extends React.Component {
  handleClick() {
    let traits = this.props.space.traits.edges
    console.log('cursor', traits)

    this.props.relay.setVariables({after: traits[traits.length - 1].cursor})
  }

  render() {
    return (
      <div>
        <h1>Pi-Base</h1>
        {this.props.children}

        <State/>
      </div>
    );
  }
}

export default App
