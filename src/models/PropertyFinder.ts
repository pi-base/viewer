import * as Fuse from 'fuse.js'
import * as I from 'immutable'

export interface Record {
  uid: string
}

export type Weights = string[] | { name: string, weight: number }[]

// TODO: unify w/ fuse usage in Filter.jsx
export class Finder<T extends Record> {
  records: I.Map<string, T>
  fuse: Fuse

  constructor(props: I.Iterable<{}, T>, weights?: Weights) {
    this.records = I.Map<string, T>(props.map((p: T) => {
      return [p.uid, p]
    }))

    this.fuse = new Fuse(props.toJS(), {
      caseSensitive: false,
      shouldSort: true,
      keys: weights || ['name', 'aliases'],
      id: 'uid',
      threshold: 0.4
    })
  }

  getId(q: string): string | undefined {
    return this.fuse.search<string>(q)[0]
  }

  search(str: string, limit?: number): I.Iterable<number, T> {
    str = str || ''
    let ids: string[] = this.fuse.search<string>(str)

    if (limit) {
      ids = ids.slice(0, limit)
    }

    return I.List(ids).map((id: string) => this.records.get(id))
  }
}
