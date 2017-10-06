import * as React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { wrap } from '../App'

import Search from './index'

it('smoke test', () => {
  const router = {
    location: {
      pathname: 'search',
      query: {
        text: 'plank',
        q: 'compact'
      },
    },
    push: (path: string) => { return },
    replace: (path: string) => { return }
  }

  const search = mount(wrap(Search, {}))

  const text = search.text()
  expect(text).toContain('Compact')
  expect(text).toContain('Tychonoff Plank')
})
