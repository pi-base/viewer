import * as React from 'react'
import { Link } from 'react-router'
import * as I from 'immutable'

import { observer } from 'mobx-react'
import { action, computed, observable } from 'mobx'
import store from '../../store'

import * as Q from '../../queries'
import * as T from '../../types'

import Filter from '../Filter'
import Implication from '../../containers/Implication'
import Preview from '../Preview'
import Tex from '../Tex'

@observer
class Theorems extends React.Component<{}, {}> {
  @observable theorems: I.List<T.Theorem>
  @observable limit: number

  showMore: () => void

  constructor() {
    super()
    this.limit = 10
    this.theorems = store.theorems.all

    this.showMore = this._showMore.bind(this)
  }

  @computed get visibleTheorems() {
    return this.theorems.take(this.limit)
  }

  @action _showMore() {
    this.limit += 10
  }

  render() {
    return (
      <section className="theorems">
        <Filter
          collection={store.theorems.all}
          onChange={theorems => this.theorems = I.List<T.Theorem>(theorems)}
          weights={[
            { name: 'if', weight: 0.7 },
            { name: 'then', weight: 0.7 },
            { name: 'description', weight: 0.5 }
          ]}
          placeholder="Filter theorems"
        />

        {this.visibleTheorems.map((t: T.Theorem) => (
          <Tex key={t.uid}>
            <h3>
              <Link to={`/theorems/${t.uid}`}>
                <Implication theorem={t} link={false} />
              </Link>
            </h3>
            <Preview text={t.description} />
          </Tex>
        ))}

        {this.theorems.size > this.visibleTheorems.size
          ? <button className="btn btn-default" onClick={this.showMore}>Show More</button>
          : ''}
      </section>
    )
  }
}

export default Theorems
