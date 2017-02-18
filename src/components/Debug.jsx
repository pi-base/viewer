import React from 'react'
import {connect} from 'react-redux'

// import JSONTree from 'react-json-tree'

class Debug extends React.Component {
  logState() {
    window.$s = this.props.state
    console.log('$s:', this.props.state.toJS())
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-bottom">
        <div className="container">
          <ul className="nav navbar-nav">
            <li>
              <a href="#" onClick={this.logState.bind(this)}>Log State</a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default connect(
  (state) => { return { state } }
)(Debug)
