import * as React from 'react'

import uuid from 'uuid/v4'
import store from '../../store'

import Form from '../../components/Theorem/Form'

class Create extends React.Component<any, {}> {
  save: () => void

  constructor(props: any) {
    super(props)
    this.save = this._save.bind(this)
  }

  _save(t: any) {
    const theorem = {
      ...t,
      uuid: uuid()
    }
    store.theorems.add(t)
    this.props.router.push(`/theorems/${t.uid}`)
  }

  render() {
    return <Form save={this.save} />
  }
}

export default Create