import Fuse from 'fuse.js'

class PropertyFinder {
  constructor(props) {
    this.names = {}
    props.forEach(p => {
      this.names[p.uid] = p.name
    })

    this.fuse = new Fuse(props, {
      caseSensitive: false,
      shouldSort: true,
      keys: ['name'],
      id: 'uid',
      threshold: 0.7
    })
  }

  resolve(p) {
    const id = this.fuse.search(p)[0]
    return find(id)
  }

  suggestionsFor(str, limit) {
    let ids
    if (str) {
      ids = this.fuse.search(str)
    } else {
      ids = this.allIds()
    }

    if (limit) {
      ids = ids.slice(0, limit)
    }

    return ids.map(id => find(id))
  }

  find(id) {
    const name = this.names[id]
    return name && {
      id,
      name
    }
  }
}

export default PropertyFinder
