import Fuse from 'fuse.js'

class PropertyFinder {
  constructor(props) {
    this.records = {}
    props.forEach(rec => {
      this.records[rec.uid] = rec
    })

    this.fuse = new Fuse(props, {
      caseSensitive: false,
      shouldSort: true,
      keys: ['name'],
      id: 'uid',
      threshold: 0.7
    })
  }

  getId(p) {
    return this.fuse.search(p)[0]
  }

  suggestionsFor(str, limit) {
    str = str || ''
    let ids = this.fuse.search(str)

    if (limit) {
      ids = ids.slice(0, limit)
    }

    return ids.map(id => this.records[id])
  }
}

export default PropertyFinder
