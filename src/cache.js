const dummyStorage = () => {
  const store = {}
  return {
    getItem: (key) => (store[key]),
    setItem: (key, item) => (store[key] = item),
  }
}

const k = (key) => `:pi-base:${key}`

class Cache {
  constructor(storage) {
    if (typeof window.localStorage === 'undefined') {
      this.storage = dummyStorage()
    } else {
      this.storage = localStorage
    }
  }

  load({
    key,
    loader,
    force
  }) {
    const val = this.get(key)
    if (!force && val) {
      return Promise.resolve(val)
    } else {
      return loader().then(val => {
        this.set(key, val)
        return val
      })
    }
  }

  get(key) {
    const item = this.storage.getItem(k(key))
    return item && JSON.parse(item)
  }

  set(key, val) {
    this.storage.setItem(k(key), JSON.stringify(val))
  }

  clear(key) {
    this.storage.removeItem(k(key))
  }
}

export default Cache
