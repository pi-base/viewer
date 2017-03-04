import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { store } from '../../test'

import Search from './index'

it('smoke test', () => {
  const loc = {
    query: ''
  }

  const search = mount(
    <Provider store={store}>
      <Search location={loc}/>
    </Provider>
  )

  console.log("search", search.text())
})
