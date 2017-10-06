import * as React from 'react'

export interface Props extends React.HTMLProps<HTMLDivElement> {
  viewExample: (q: string) => void
}

class Examples extends React.Component<Props, {}> {
  examples() {
    return [
      {
        name: 'All Non-Metric Continua',
        q: 'compact + connected + t_2 + ~metrizable'
      },
      {
        name: 'A Common Non-Theorem',
        q: 'first countable + separable + ~second countable'
      }
      // {
      //   name: 'A Class of Examples by Name',
      //   q: ':plank'
      // },
      // {
      //   name: 'New Things to Prove',
      //   q: '?metacompact'
      // }
    ]
  }

  example({ name, q }: { name: string, q: string }) {
    const { viewExample } = this.props

    return (
      <article key={q}>
        <h5>{name}</h5>
        <a onClick={() => viewExample(q)}>
          <pre>{q}</pre>
        </a>
      </article>
    )
  }

  render() {
    return (
      <div className={this.props.className}>
        <p>Not sure where to start? Try one of the following searches</p>
        {this.examples().map(ex =>
          this.example(ex)
        )}
      </div>
    )
  }
}

export default Examples
