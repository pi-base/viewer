import * as A from './actions'
import * as Q from './queries'

import traits from '../fixtures/traits.json'

import FuzzyFinder from './models/FuzzyFinder'
import {
  makeStore
} from './store'

// Before all, load fixtures
const store = makeStore()
let state

beforeAll(() => {
  store.dispatch({
    type: A.FETCH_DONE,
    payload: traits
  })
  state = store.getState()
})

it('loaded fixtures', () => {
  expect(state.getIn(['spaces', 'entities']).size).toEqual(10)
  expect(state.getIn(['spaces', 'finder'])).toBeInstanceOf(FuzzyFinder)

  expect(state.getIn(['properties', 'entities']).size).toEqual(10)
  expect(state.getIn(['properties', 'finder'])).toBeInstanceOf(FuzzyFinder)

  expect(state.get('traits').size).toEqual(10)
})

it('can parse search formula', () => {
  const f = Q.parseSearchFormula(state, 'compact + lind')

  expect(f.subs[0].property.name).toEqual('Compact')
  expect(f.subs[1].property.name).toEqual('Lindelof')
})

it('can run a search', () => {
  const f = Q.parseSearchFormula(state, 'Normal + ~Compact')
  const results = Q.runSearch(state, f)

  expect(results.size).toEqual(3)
  expect(results.toJS()[0]).toEqual({
    id: '2',
    name: 'Countable Discrete Topology'
  })
})

it('caches the last successfully parsed search formula', () => {
  store.dispatch(A.search('urysohn + compact'))
  let s = store.getState()

  const f = Q.searchFormula(s)
  expect(f.and.length).toEqual(2)

  store.dispatch(A.search('+ | t_2 | compact + connected'))
  s = store.getState()
  expect(Q.searchFormula(s)).toEqual(f)
})

it('can get suggestions for the search fragment', () => {
  const sugs = Q.suggestionsFor(state, 'normal + comple')

  expect(sugs[0].name).toEqual('Completely Regular')
  expect(sugs[1].name).toEqual('Completely Normal')
  expect(sugs.length).toEqual(8)
})

it('can filter space traits', () => {
  const ts = Q.filteredTraitsForSpace(state, {
    uid: '12'
  }, 'compac')

  expect(ts[0].property.name).toEqual('Compact')
  expect(ts[0].value).toEqual(true)

  expect(ts[1].property.name).toEqual('$\\sigma$-compact')

  expect(ts.length).toEqual(7)
})
