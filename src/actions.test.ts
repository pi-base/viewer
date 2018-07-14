import * as A from './actions'
import * as G from './graph'

import { Action, Branch } from './types'

import { State } from './reducers'
import { ThunkDispatch } from 'redux-thunk'
import { activeBranch } from './selectors'
import { atom } from './models/Formula'
import fetch from 'node-fetch'
import { makeStore } from './store'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

const initial = 'd71e74370ea1d293197fdffd5f89c357ed45a273'
let userBranch: Branch = undefined!

const token = (() => {
  let t: string | null = '' // FIXME: need a better strategy for getting a working token in test

  return {
    get: () => t,
    set: value => t = value,
    clear: () => t = null
  }
})()

const graph = G.makeClient({ token, fetch })

const createUser = (name: string): Promise<string> => {
  return fetch('http://localhost:3141/users', {
    method: 'POST',
    body: JSON.stringify({ ident: name })
  }).
    then(res => res.json()).
    then(json => json.token.uuid)
}

const store = makeStore({ graph, token })
const dispatch = (action) => store.dispatch(action)

beforeAll(async () => {
  const t = await createUser('test')
  userBranch = { name: 'users/test' } as Branch
  token.set(t)
  const user = await dispatch(A.login(t))
  return dispatch(A.changeBranch(userBranch.name))
})

const reset = () => dispatch(A.resetBranch(userBranch.name, initial))

xit('can create a space', async () => {
  await reset()

  await dispatch(A.createSpace({
    uid: '123', name: 'S', description: 'New Space', references: []
  }))

  const state: State = store.getState()
  expect(state.spaces.get('123')!.name).toEqual('S')

  const sha = activeBranch(state)!.sha
  expect(sha.length).toEqual(40)
  expect(sha).not.toEqual(initial)
})

it('runs api calls without error', async () => {
  await reset()

  const s1 = { uid: 's1', name: 'S', references: [], description: 'S' }
  const s2 = { uid: 's2', name: 'T', references: [], description: 'T' }
  const p1 = { uid: 'p1', name: 'P', references: [], description: 'P' }
  const p2 = { uid: 'p2', name: 'Q', references: [], description: 'Q' }

  const t1 = {
    uid: '',
    space: s1,
    property: p1,
    value: true,
    deduced: false,
    description: '',
    references: []
  }

  const t2 = {
    uid: '',
    space: s2,
    property: p2,
    value: false,
    deduced: false,
    description: '',
    references: []
  }

  const i1 = {
    uid: 't1',
    if: atom(p1.uid, true),
    then: atom(p2.uid, true),
    references: [],
    description: ''
  }

  await dispatch(A.createSpace({ ...s1, references: [] }))
  await dispatch(A.createSpace({ ...s2, references: [] }))

  await dispatch(A.createProperty(p1))
  await dispatch(A.createProperty(p2))

  await dispatch(A.assertTrait(t1))
  await dispatch(A.assertTrait(t2))

  await dispatch(A.assertTheorem(i1))

  await dispatch(A.updateSpace({ ...s1, description: 'Updated' }))
  await dispatch(A.updateProperty({ ...p1, description: 'Updated' }))
  await dispatch(A.updateTrait({ ...t1, description: 'Updated' }))
  await dispatch(A.updateTheorem({ ...i1, description: 'Updated' }))
})