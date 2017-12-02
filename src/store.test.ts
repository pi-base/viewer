import * as fs from 'fs'

import * as F from './models/Formula'
import * as T from './types'

import { Store } from './store'

let store: Store

describe('with fixture data', () => {
  const view = JSON.parse(fs.readFileSync('./test/fixtures/full.json', 'utf8')).viewer

  beforeEach(() => {
    store = new Store()
    store.addView(view)
  })

  const parse = (str: string) => {
    // tslint:disable-next-line no-any
    return F.mapProperty(p => (p as any).uid, store.parseFormula(str) as any) // ignore parse failures
  }

  it('can load a viewer', () => {
    expect(store.spaces.all.size).toBeGreaterThan(100)
    expect(store.properties.all.size).toBeGreaterThan(60)
    expect(store.theorems.all.size).toBeGreaterThan(200)
  })

  it('can find spaces by text', () => {
    const results = store.search({ text: 'plank' })
    expect(results.size).toBeLessThan(10)
    expect(results.get(0).name).toContain('plank')
  })

  it('can find spaces by properties', () => {
    const f = parse('compact + connected')
    const results = store.search({ formula: f })
    expect(results.size).toBeLessThan(20)
    expect(results.map(s => s!.name)).toContain('Lexicographic unit square')
  })

  it('can find counterexamples to a theorem')
})