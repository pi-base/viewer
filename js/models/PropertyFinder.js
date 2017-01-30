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
        const id   = this.fuse.search(str)[0]
        const name = this.properties[id]
        return { id, name }
    }
}
