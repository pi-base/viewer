import Fuse from 'fuse.js'

// TODO: we don't need both this and PropertyFinder ...
export default class FuzzyFinder {
  constructor(collection) {
    // TODO: store this as an immutable collection and refactor
    // { id: name }
    this.collection = collection

    let names = []
    for (let id in collection) {
      if (collection.hasOwnProperty(id)) {
        names.push({
          id: id,
          name: collection[id]
        })
      }
    }

    this.fuse = new Fuse(names, {
      caseSensitive: false,
      shouldSort: true,
      keys: ['name'],
      id: 'id',
      threshold: 0.7
    })
  }

  resolve(str) {
    if (!str) {
      return null
    }
    return this.suggestionsFor(str, 1)[0]
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

    return ids.map(id => ({
      id: id,
      name: this.collection[id]
    }))
  }

  allIds() {
    let result = []
    for (let id in this.collection) {
      if (this.collection.hasOwnProperty(id)) {
        result.push(id)
      }
    }
    return result
  }
}
