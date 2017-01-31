import Fuse from 'fuse.js'

export default class PropertyFinder {
    constructor(properties) {
      this.properties = properties

      let names = []
      for (var id in properties) {
        names.push({ id: id, name: properties[id] })
      }

      this.fuse = new Fuse(names, {
        caseSensitive: false,
        shouldSort:    true,
        keys:          ['name'],
        id:            'id',
        threshold:     0.7
      })
    }

    resolve(str) {
      return this.suggestionsFor(str, 1)[0]
    }

    suggestionsFor(str, limit) {
      limit = limit || 10
      const ids = this.fuse.search(str).slice(0, limit)
      return ids.map(id => ({ id: id, name: this.properties[id] }))
    }
}
