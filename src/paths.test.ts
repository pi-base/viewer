import { resolveId } from './paths'

describe('resolveId', () => {
  it('resolves theorem ids', () => {
    expect(resolveId('T000001')).toEqual('/theorems/T000001')
  })
})
