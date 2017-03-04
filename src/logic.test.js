import * as I from 'immutable'
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
