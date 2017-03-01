import * as A from './actions'
import * as Q from './queries'

import * as F from './models/Formula'
import reducer from './reducers'

import fs from 'fs'
import paths from '../config/paths'
let data = JSON.parse(fs.readFileSync(paths.appPublic + '/db', 'utf8'));

let state
beforeAll(() => {
  state = reducer(null, {
    type: A.fetch(A.DONE, A.OBJECTS),
    payload: data
  })
})

it('can pull collections', () => {
  expect(Q.allSpaces(state).size).toEqual(149)
  expect(Q.allProperties(state).size).toEqual(75)
  expect(Q.allTheorems(state).size).toEqual(168)
})

it('can find spaces', () => {
  const s = Q.findSpace(state, 'Finite Discrete Topology')
  expect(s.get('uid')).toEqual('S000001')
})

it('can find properties', () => {
  const p = Q.findProperty(state, 'Compact').toJS()
  expect(p.uid).toEqual('P000016')

  const rel = Q.relatedTheorems(state, p)
  expect(rel.size).toEqual(10)
})

it('can find theorems', () => {
  const t = Q.findTheorem(state, 'I000059')
  const f = (name) => t.get(name).map(F.withProperty(p => p.name))

  expect(f('antecedent')).toEqual(
    F.and([
      F.atom('$T_2$', true),
      F.atom('Locally Compact', true)
    ])
  )
  expect(f('consequent')).toEqual(
    F.atom('Second Category', true)
  )

  expect(Q.counterexamples(state, t).map(s => s.get('name'))).toContain('Indiscrete Topology')
})

it('can parse search formula', () => {
  const f = Q.parseFormula(state, 'compact + lind')

  expect(f.and[0].property.name).toEqual('Compact')
  expect(f.and[1].property.name).toEqual('Lindelof')
})

it('can run a search by formula', () => {
  const q = 'Compact'
  const f = Q.parseFormula(state, q)
  const results = Q.runSearch(state, q, f)

  expect(results.type).toEqual(Q.BY_FORMULA)
  expect(results.formula).toEqual(f)
  expect(results.spaces.size).toEqual(39)

  expect(
    results.spaces.sortBy(s => s.name).getIn(['0', 'name'])
  ).toEqual(
    'Finite Discrete Topology'
  )
})

it('can get suggestions for the search fragment', () => {
  const sugs = Q.suggestionsFor(state, 'normal + comple')

  expect(sugs.get('0').name).toEqual('Completely Normal')
  expect(sugs.get('1').name).toEqual('Completely Regular')
  expect(sugs.size).toEqual(48)
})

it('can filter space traits', () => {
  const ts = Q.spaceTraits(state, {
    uid: 'S000012'
  }).sortBy(t => t.getIn(['property', 'name'])).toJS()

  expect(ts[0].property.name).toEqual('$T_0$')
  expect(ts[0].value).toEqual(true)

  expect(ts[30].property.name).toEqual('Fully $T_4$')

  expect(ts.length).toEqual(66)
})

fit('can compose space filters', () => {
  const s1 = Q.filter(state, {
    text: 'plank'
  })

  let result = s1.valueSeq().toJS()
  expect(result[0].name).toContain('Plank')
  expect(result.length).toEqual(57)

  const f = Q.parseFormula(state, 'Compact')
  const s2 = Q.filter(state, {
    formula: f,
    spaces: s1,
    value: true
  })

  result = s2.valueSeq().toJS()
  expect(result[0].name).toEqual('Tychonoff Plank')
  expect(result.length).toEqual(13)
})
