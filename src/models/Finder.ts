import * as Fuse from 'fuse.js'

export interface Record {
  uid: string
}

export type Weights = string[] | { name: string, weight: number }[]

export class Finder<T extends Record> {
  records: Map<string, T>
  fuse: Fuse

  constructor(props: T[], weights?: Weights) {
    this.records = new Map()
    props.forEach(p => this.records.set(p.uid, p))

    this.fuse = new Fuse(props, {
      caseSensitive: false,
      shouldSort: true,
      keys: weights || ['name', 'aliases'],
      id: 'uid',
      threshold: 0.4
    })
  }

  find(q: string): T | undefined {
    return this.search(q, 1)[0]
  }

  getId(q: string): string | undefined {
    return this.fuse.search<string>(q)[0]
  }

  search(str: string, limit?: number): T[] {
    str = str || ''
    if (str !== '' + str) { return [] }
    let ids: string[] = this.fuse.search<string>(str)

    if (limit) {
      ids = ids.slice(0, limit)
    }

    return ids.map(id => this.records.get(id)!)
  }
}
