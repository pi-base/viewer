// tslint:disable no-any
interface Storage {
  getItem: (key: string) => any
  setItem: (key: string, item: any) => void
  removeItem: (key: string) => void
}
// tslint:enable no-any

export type CacheKey = 'objects' | 'version' | 'token'

function dummyStorage(): Storage {
  const store = {}
  return {
    getItem: (key) => (store[key]),
    setItem: (key, item) => (store[key] = item),
    removeItem: (key) => (delete store[key])
  }
}

function k(key: CacheKey): string {
  return `:pi-base:${key.toUpperCase()}`
}

class Cache {
  storage: Storage
  constructor(storage?: Storage) {
    if (typeof(window.localStorage) === 'undefined' || !window.localStorage.getItem) {
      this.storage = dummyStorage()
    } else {
      this.storage = localStorage
    }
  }

  // tslint:disable-next-line no-any
  load({ key, loader, force }: { key: CacheKey, force: boolean, loader: () => Promise<any> }) {
    const cached = this.get(key)
    if (!force && cached) {
      return Promise.resolve(cached)
    } else {
      return loader().then(loaded => {
        this.set(key, loaded)
        return loaded
      })
    }
  }

  get(key: CacheKey) {
    const item = this.storage.getItem(k(key))
    return item && JSON.parse(item)
  }

  // tslint:disable-next-line no-any
  set(key: CacheKey, val: any) {
    this.storage.setItem(k(key), JSON.stringify(val))
  }

  clear(key: CacheKey) {
    this.storage.removeItem(k(key))
  }
}

export default Cache

export const cache = new Cache()
