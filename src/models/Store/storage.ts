import { Id, SerializedBundle, bundle } from '@pi-base/core'

import type { Store } from './state'

const storageKey = 'pibase.bundle'

type Serialized = {
  bundle: SerializedBundle
  etag: string | null
  remote: {
    branch: string
    host: string
    state: Store['remote']['state']
    fetched: string
  }
  checked: Id[]
  error: string | null
}

export function serialize(store: Store): Serialized {
  return {
    bundle: bundle.serialize(store.bundle),
    etag: store.etag,
    remote: {
      ...store.remote,
      fetched: store.remote.fetched.toJSON(),
    },
    checked: Array.from(store.checked),
    error: store.error,
  }
}

export function deserialize(serialized: Serialized): Store {
  return {
    bundle: bundle.deserialize(serialized.bundle || ({} as any)),
    etag: serialized.etag || null,
    remote: {
      ...serialized.remote,
      fetched: new Date(serialized.remote.fetched),
    },
    checked: new Set(serialized.checked || []),
    error: serialized.error || null,
  }
}

export function load(storage = localStorage): Store | undefined {
  const raw = storage.getItem(storageKey)
  if (!raw) {
    return
  }

  try {
    return deserialize(JSON.parse(raw))
  } catch (e) {
    localStorage.removeItem(storageKey)
    throw e
  }
}

export function save(store: Store, storage = localStorage) {
  storage.setItem(storageKey, JSON.stringify(serialize(store)))
}
