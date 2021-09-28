import { Writable, get, writable } from 'svelte/store'
import { SuggestionStore, suggestionStore } from './suggestions'

describe('suggestions', () => {
  let value: Writable<string>
  let suggestions: SuggestionStore

  beforeEach(() => {
    value = writable('')
    suggestions = suggestionStore(value, () => ['foo', 'bar', 'baz'])
  })

  it('can apply suggestions', () => {
    suggestions.run('b')
    suggestions.next()
    suggestions.next()
    suggestions.apply()

    expect(get(value)).toEqual('bar')
  })

  it('can apply suggestions to only a fragment', () => {
    suggestions.run('bar + f')
    suggestions.next()
    suggestions.apply()

    expect(get(value)).toEqual('bar + foo')
  })

  it('can loop around', () => {
    suggestions.run('a')

    suggestions.prev()

    expect(get(suggestions).selected).toEqual(-1)
  })
})
