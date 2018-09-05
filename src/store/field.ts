export interface Field<V> {
  get: () => V | null
  set: (value: V) => void
  clear: () => void
}

export const local = <V>(key: string): Field<V> => {
  key = `piBase.${key}`
  return {
    get: () => {
      const val = localStorage.getItem(key)
      if (!val) { return null }
      return JSON.parse(val)
    },
    set: val => localStorage.setItem(key, JSON.stringify(val)),
    clear: () => localStorage.removeItem(key)
  }
}

export const memory = <V>(key: string): Field<V> => {
  let value: V | null = null
  return {
    get: () => value,
    set: v => value = v,
    clear: () => value = null
  }
}

export default local