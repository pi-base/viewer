import React from 'react';

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
      </div>
    );
  }
}

export default App;
