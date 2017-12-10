import * as Q from './queries'
import * as L from './logic'

import {
  state
} from './test'

it('can disprove with direct implications', () => {
  const f = Q.parseFormula(state, 't_1 + ~t_0')
  const result = L.disprove(state, f)

  expect(result.map(t => t.get('uid'))).toEqual(
    I.List(['I000119'])
  )
})

it('can disprove with chained implications', () => {
  const f = Q.parseFormula(state, 't_2 + ~t_0')
  const result = L.disprove(state, f)

  expect(result.map(t => t.get('uid'))).toEqual(
    I.List(['I000173', 'I000174'])
  )
})

it('can disprove with compound implications', () => {
  const f = Q.parseFormula(state, 'metrizable + ~countably metacompact')
  const result = L.disprove(state, f)

  expect(result.map(t => t.get('uid'))).toEqual(
    I.List(['I000171', 'I000016', 'I000056', 'I000014'])
  )
})

it('can disprove one that it had trouble with', () => {
  const f = Q.parseFormula(state, 't_3 + ~t_2')
  const result = L.disprove(state, f)

  expect(result.map(t => t.get('uid'))).toEqual(
    I.List(['I000236', 'I000032'])
  )
})

it('handles reversing conjunctions', () => {
  const f = Q.parseFormula(state, 'second countable + ~separable')
  const result = L.disprove(state, f)

  expect(result.map(t => t.get('uid'))).toEqual(
    I.List(['I000125'])
  )
})

it('handles tautologies', () => {
  const f = Q.parseFormula(state, 'compact + ~compact')
  const result = L.disprove(state, f)

  expect(result).toEqual(L.TAUTOLOGY)
})