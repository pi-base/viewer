/* global MathJax */
import React from 'react'
import ReactDOM from 'react-dom'

class Tex extends React.Component {
    componentDidMount() { this.queue() }

    componentDidUpdate() { this.queue() }

    queue() {
        const node = ReactDOM.findDOMNode(this)
        if (typeof(MathJax) !== `undefined`) {
          MathJax.Hub.Queue([`Typeset`, MathJax.Hub, node])
        }
    }

    render() {
        return <this.props.component className={this.props.className}>
          {this.props.children}
        </this.props.component>
    }
}

Tex.defaultProps = {
  component: 'div'
}

export default Tex
