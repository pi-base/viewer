import * as I from 'immutable'

import * as Q from './queries'
import * as F from './models/Formula'

import {
  state
} from './test'

it('can pull collections', () => {
  expect(Q.allSpaces(state).size).toBeGreaterThan(159)
  expect(Q.allProperties(state).size).toBeGreaterThan(99)
  expect(Q.allTheorems(state).size).toBeGreaterThan(225)
})

it('can find spaces', () => {
  const s = Q.findSpace(state, 'S000001')
  expect(s.get('name')).toEqual('Finite Discrete Topology')
})

it('can find properties', () => {
  const p = Q.findProperty(state, 'P000016')
  expect(p.get('name')).toEqual('Compact')

  const rel = Q.relatedTheorems(state, p)
  expect(rel.size).toBeGreaterThan(15)
})

it('can find theorems', () => {
  const t = Q.findTheorem(state, 'I000059')
  const f = (name) => t.get(name).mapProperty(p => p.get('name'))

  expect(f('if')).toEqual(
    F.and(
      F.atom('Locally Compact', true),
      F.atom('$T_2$', true)
    )
  )
  expect(f('then')).toEqual(
    F.atom('Second Category', true)
  )

  expect(Q.counterexamples(state, t).map(s => s.get('name'))).toContain('Indiscrete Topology')
})

it('can parse search formula', () => {
  const f = Q.parseFormula(state, 'compact + lind')

  expect(f.mapProperty(p => p.get('name'))).toEqual(
    F.and(
      F.atom('Compact', true),
      F.atom('Lindelof', true)
    )
  )
})

it('can get suggestions for the search fragment', () => {
  const sugs = Q.suggestionsFor(state, 'normal + comple')

  expect(sugs.getIn(['0', 'name'])).toEqual('Completely Normal')
  expect(sugs.getIn(['1', 'name'])).toEqual('Completely Regular')
  expect(sugs.size).toBeGreaterThan(20)
})

it('can filter space traits', () => {
  const ts = Q.spaceTraits(state, I.Map({
    uid: 'S000012'
  })).sortBy(t => t.getIn(['property', 'name'])).toJS()

  expect(ts[0].property.name).toEqual('$T_0$')
  expect(ts[0].value).toEqual(true)

  expect(ts[30].property.name).toEqual('Fréchet Urysohn')

  expect(ts.length).toBeGreaterThan(77)
})
