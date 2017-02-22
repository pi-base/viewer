import Fuse from 'fuse.js'
import * as I from 'immutable'

// TODO: unify w/ fuse usage in Filter.jsx
class PropertyFinder {
  constructor(props) {
    this.records = {}
    props.forEach(rec => {
      this.records[rec.get('uid')] = rec
    })

    this.fuse = new Fuse(props.toJS(), {
      caseSensitive: false,
      shouldSort: true,
      keys: ['name'],
      id: 'uid',
      threshold: 0.5
    })
  }

  getId(p) {
    return this.fuse.search(p)[0]
  }

  suggestionsFor(str, limit) {
    return this.search(str, limit).map(id => this.records[id])
  }

  search(str, limit) {
    str = str || ''
    let ids = this.fuse.search(str)

    if (limit) {
      ids = ids.slice(0, limit)
    }

    return I.List(ids)
  }
}

export default PropertyFinder
