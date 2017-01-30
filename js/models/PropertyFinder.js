import Fuse from 'fuse.js'

export default class PropertyFinder {
    constructor(properties) {
      this.names = []
      for (var id in properties) {
        this.names.push({ id: id, name: properties[id] })
      }
      console.log(
        'names', this.names
      )

      this.fuse = new Fuse(this.names, {
        caseSensitive: false,
        shouldSort:    true,
        keys:          ['name'],
        id:            'id',
        threshold:     0.7
      })
    }

    resolve(str) {
        const id = this.fuse.search(str)[0]
        return {
          id:   id,
          name: this.names[id]
        }
    }
}
