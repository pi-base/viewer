import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { store } from '../../test'

import Search from './index'

it('smoke test', () => {
  const loc = {
    query: {
      text: 'plank',
      q: 'compact'
    }
  }

  const search = mount(
    <Provider store={store}>
      <Search location={loc}/>
    </Provider>
  )

  const text = search.text()
  expect(text).toContain("Compact")
  expect(text).toContain("Tychonoff Plank")
})
