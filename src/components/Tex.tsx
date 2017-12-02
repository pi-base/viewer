import * as React from 'react'
import * as ReactDOM from 'react-dom'

// tslint:disable-next-line no-any
declare var MathJax: any

interface Props extends React.HTMLProps<HTMLDivElement> {
  component?: string
}

class Tex extends React.Component<Props, {}> {
  componentDidMount() { this.queue() }

  componentDidUpdate() { this.queue() }

  queue() {
    const node = ReactDOM.findDOMNode(this)
    if (typeof (MathJax) !== `undefined`) {
      MathJax.Hub.Queue([`Typeset`, MathJax.Hub, node])
    }
  }

  render() {
    const { className, children } = this.props
    const Component = this.props.component || 'div'

    return (
      <Component className={className}>
        {children}
      </Component>
    )
  }
}

export default Tex
