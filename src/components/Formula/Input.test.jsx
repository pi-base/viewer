import React from 'react'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import { store } from '../../test'

import Input from './Input'

it ('can use keyboard shortcuts', () => {
  const cb = jest.fn()

  const input = mount(
    <Provider store={store}>
      <Input q="comp" onChange={cb}/>
    </Provider>
  )

  const i = input.find('input')

  i.simulate('change')
  i.simulate('keyDown', {
    which: 40
  })
  i.simulate('keyDown', {
    which: 40
  })
  i.simulate('keyDown', {
    which: 13
  })

  const calls = cb.mock.calls
  expect(calls.length).toEqual(2)
  expect(calls[0][0].q).toEqual('comp')
  expect(calls[1][0].q).toEqual('Compact')
})
