import * as React from 'react'
import { Dispatch, connect } from 'react-redux'

import { search } from '../../actions'
import { Action, Formula, Id } from '../../types'

type Example = { name: string, query: string }

type DispatchProps = {
  search: (formula: string) => void
}
type Props = DispatchProps & React.HTMLProps<HTMLDivElement>

const examples: Example[] = [
  {
    name: 'All Non-Metric Continua',
    query: 'compact + connected + t_2 + ~metrizable'
  },
  {
    name: 'A Common Non-Theorem',
    query: 'first countable + separable + ~second countable'
  }
]

const Example = (props: Example & DispatchProps) => (
  <article key={props.query}>
    <h5>{props.name}</h5>
    <a onClick={() => props.search(props.query)}>
      <pre>{props.query}</pre>
    </a>
  </article>
)

const Examples = (props: Props) => {
  return (
    <div className={props.className}>
      <p>Not sure where to start? Try one of the following searches</p>
      {examples.map(example =>
        <Example key={example.name} {...example} search={props.search} />
      )}
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<Action>): DispatchProps => ({
  search: (formula) => dispatch(search({ text: '', formula }))
})

export default connect<{}, DispatchProps>(
  () => ({}),
  mapDispatchToProps
)(Examples)
