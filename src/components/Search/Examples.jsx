import React from 'react'

class Examples extends React.Component {
  examples() {
    return [
      {
        name: 'All Non-Metric Continua',
        q: 'compact + connected + ~metrizable'
      },
      {
        name: 'A Common Non-Theorem',
        q: 'first countable + separable + ~second countable'
      }
    ]
  }

  example(ex) {
    return (
      <example key={ex.q}>
        <h5>{ex.name}</h5>
        <a onClick={() => this.props.runSearch(ex.q)}>
          <pre>{ex.q}</pre>
        </a>
      </example>
    )
  }

  render() {
    return (
      <div>
        {this.examples().map(ex =>
          this.example(ex)
        )}
      </div>
    )
  }
}

export default Examples
