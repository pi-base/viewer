import * as React from 'react'

import { Dispatch, State } from '../../types'

import { connect } from 'react-redux'
import { search } from '../../actions'

type Example = { name: string, query: string }

type DispatchProps = {
  search: (formula: string) => void
}
type OwnProps = React.HTMLProps<HTMLDivElement>
type Props = DispatchProps & OwnProps

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

const Example = ({ example, onClick }: { example: Example, onClick: () => void }) => (
  <article>
    <h5>{example.name}</h5>
    <a onClick={onClick}>
      <pre>{example.query}</pre>
    </a>
  </article>
)

const Examples = (props: Props) => {
  return (
    <div className={props.className}>
      <p>Not sure where to start? Try one of the following searches</p>
      {examples.map(example =>
        <Example key={example.name} example={example} onClick={() => props.search(example.query)} />
      )}
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  search: (formula) => dispatch(search({ text: '', formula }))
})

export default connect<{}, DispatchProps, OwnProps, State>(
  null,
  mapDispatchToProps
)(Examples)
