import { Bundle, bundle } from '@pi-base/core'
import type { Space } from './models'
import type { Handler } from './errors'
import { Store, uncheckedSpaces } from './models/Store'
import { load } from './models/Store'
import { defaultHost } from './models/Store'

export { save } from './models/Store'

export type Action =
  | { action: 'loaded'; value: Store }
  | { action: 'check.started'; count: number }
  | { action: 'check'; space: Space }
  | { action: 'check.done' }
  | { action: 'fetch.started'; branch: string; host: string }
  | { action: 'fetch.done' }
  | { action: 'fetch.error'; error: Error }

export type Dispatch = (action: Action) => void

export async function boot(
  dispatch: Dispatch,
  handler: Handler,
  loader = load
) {
  let loaded: Store
  try {
    loaded = loader()
  } catch (error) {
    handler.error(error)
  }

  if (loaded) {
    dispatch({ action: 'loaded', value: loaded })
  }

  await refresh({
    dispatch,
    branch: loaded?.remote?.branch || 'main',
    host: loaded?.remote?.host || defaultHost,
    store: loaded,
    handler,
  })
}

async function pause(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 0)
  })
}

export async function check({
  dispatch,
  store,
}: {
  dispatch: Dispatch
  store: Store
}) {
  const spaces = uncheckedSpaces(store)
  dispatch({ action: 'check.started', count: spaces.length })

  for (const space of spaces) {
    dispatch({ action: 'check', space })
    await pause()
  }

  dispatch({ action: 'check.done' })
}

export async function refresh({
  branch,
  dispatch,
  fetch = bundle.fetch,
  host,
  store,
  handler,
}: {
  branch: string
  dispatch: Dispatch
  fetch?: Fetcher
  host: string
  store: Store | undefined
  handler: Handler
}) {
  dispatch({ action: 'fetch.started', branch, host })

  try {
    const next = await sync(store, { branch, host }, fetch)
    dispatch({ action: 'fetch.done' })
    if (!next) {
      return
    } // Bundle was unchanged

    dispatch({ action: 'loaded', value: next })
    await check({ store: next, dispatch })
  } catch (error) {
    handler.error(error)
    if (error instanceof Error) {
      dispatch({ action: 'fetch.error', error })
    } else {
      dispatch({ action: 'fetch.error', error: new Error(`${error}`) })
    }
  }
}

type Fetcher = (
  opts: FetchOpts
) => Promise<{ bundle: Bundle; etag: string } | null>

type FetchOpts = {
  branch: string
  host: string
  etag?: string
}

async function sync(
  store: Store | undefined,
  { branch, host }: FetchOpts,
  fetch: Fetcher = bundle.fetch
): Promise<Store | undefined> {
  const fetched = await fetch({
    branch,
    host,
    etag: store?.etag || undefined,
  })

  if (!fetched) {
    return
  }

  return {
    bundle: fetched.bundle,
    etag: fetched.etag,
    remote: {
      branch,
      host,
      state: 'done',
      fetched: new Date(),
    },
    checked: new Set(),
    error: null,
  }
}

export function hardReset() {
  localStorage.clear()
  window.location.reload()
}
