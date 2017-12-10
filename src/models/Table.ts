export type Table<K, L, V> = Map<K, Map<L, V>>

export function set<K, L, V>(table: Table<K, L, V>, k: K, l: L, v: V) {
  if (!table.has(k)) {
    table.set(k, new Map())
  }
  table.get(k)!.set(l, v)
}

export function get<K, L, V>(table: Table<K, L, V>, k: K, l: L): V | undefined {
  if (table.has(k)) {
    return table.get(k)!.get(l)
  }
  return
}