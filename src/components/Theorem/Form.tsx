import * as React from 'react'

import { observer } from 'mobx-react'
import { computed, observable } from 'mobx'
import uuid from 'uuid/v4'

import * as F from '../../models/Formula'
import * as T from '../../types'

import Detail from '../../components/Theorem/Detail'
import FormulaInput from '../../components/Formula/Input'

type Formula = F.Formula<T.Property>

@observer
class Form extends React.Component<any, {}> {
  @observable uid: T.Id
  @observable if: Formula | undefined
  @observable then: Formula | undefined
  @observable description: string

  constructor(props: any) {
    super(props)
    if (props.theorem) {
      this.uid = props.theorem.uid
      this.if = props.theorem.if
      this.then = props.theorem.then
      this.description = props.theorem.description
    } else {
      this.uid = uuid()
      this.description = ''
    }
  }

  @computed get theorem() {
    if (!this.if || !this.then) { return }

    return {
      uid: this.uid,
      if: this.if,
      then: this.then,
      description: this.description
    }
  }

  setIf(f?: Formula) {
    console.log('if', (f as any).property)
    this.if = f
  }

  setThen(f?: Formula) {
    console.log('then', (f as any).property)
    this.then = f
  }

  save(e: any) {
    e.preventDefault()
    return this.props.save(this.theorem)
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={e => this.save(e)}>
            <div className="form-group">
              <label htmlFor="if">If</label>
              <FormulaInput onFormulaChange={f => this.setIf(f)} />
            </div>
            <div className="form-group">
              <label htmlFor="if">Then</label>
              <FormulaInput onFormulaChange={f => this.setThen(f)} />
            </div>
            <div className="form-group">
              <label htmlFor="if">Description</label>
              <textarea
                name="description"
                value={this.description}
                onChange={e => this.description = e.target.value}
                className="form-control"
                rows={10}
              />
            </div>
          </form>
        </div>

        <div className="col-md-6">
          {JSON.stringify(this.theorem)}
          {this.theorem
            ? <Detail theorem={this.theorem as any} />
            : ''
          }
        </div>
      </div>
    )
  }
}

export default Form