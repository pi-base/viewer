import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql'
import { v4 as uuid } from 'uuid'

import * as F from './models/Formula'
import * as G from './graph'
import * as T from './types'
import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

export type AddProperty = { type: 'ADD_PROPERTY', property: T.Property }
export type AddSpace = { type: 'ADD_SPACE', space: T.Space }
export type AssertTheorem = { type: 'ASSERT_THEOREM', theorem: T.Theorem }
export type AssertTrait = { type: 'ASSERT_TRAIT', trait: T.Trait }
export type CheckProofs = { type: 'CHECK_PROOFS', spaces?: T.Space[] }
export type ChangeBranch = { type: 'CHANGE_BRANCH', branch: T.BranchName | undefined }
export type LoadViewer = { type: 'LOAD_VIEWER', viewer: G.ViewerQuery }
export type Login = { type: 'LOGIN', token: T.Token, user: T.User, branches: T.Branch[] }
export type Logout = { type: 'LOGOUT' }
export type Search = { type: 'SEARCH', text?: string, formula?: string }
export type UpdateBranch = { type: 'UPDATE_BRANCH', branch: T.BranchName, sha: T.Sha }
export type ToggleDebug = { type: 'TOGGLE_DEBUG' }
export type SubmittingBranch = { type: 'SUBMITTING_BRANCH', branch: T.Branch }
export type SubmittedBranch = { type: 'SUBMITTED_BRANCH', branch: T.Branch, url: string }

// tslint:disable no-any
export type QueryError = { type: 'QUERY_ERROR', id: string, error: any }
export type QueryStart = { type: 'QUERY_START', id: string, query: any }
export type QuerySuccess = { type: 'QUERY_SUCCESS', id: string, data: any }

export type PersistSuccess = { type: 'PERSIST_SUCCESS', version: string }
// tslint:enable no-any

export type Action
  = AddProperty
  | AddSpace
  | AssertTheorem
  | AssertTrait
  | ChangeBranch
  | CheckProofs
  | LoadViewer
  | Login
  | Logout
  | PersistSuccess
  | QueryError
  | QueryStart
  | QuerySuccess
  | Search
  | UpdateBranch
  | ToggleDebug
  | SubmittingBranch
  | SubmittedBranch

export const toggleDebug = (): Action => ({ type: 'TOGGLE_DEBUG' })

export const addProperty = (property: T.Property): Action => ({
  type: 'ADD_PROPERTY', property
})

export const addSpace = (space: T.Space): Action => ({
  type: 'ADD_SPACE', space
})

const updateBranch = (branch: T.BranchName, sha: T.Sha): Action => ({
  type: 'UPDATE_BRANCH', branch, sha
})

export const addTheorem = (theorem: T.Theorem): Action => ({
  type: 'ASSERT_THEOREM', theorem
})

export const addTrait = (trait: T.Trait): Action => ({
  type: 'ASSERT_TRAIT', trait
})

export const checkProofs = (spaces?: T.Space[]): Action => ({
  type: 'CHECK_PROOFS', spaces
})

export const search = ({ text, formula }: { text?: string, formula?: string }): Action => {
  return { type: 'SEARCH', text, formula }
}

type Async<R> = ThunkAction<Promise<R>, T.State, { graph: G.Client, token: T.TokenStorage }>

type QueryParams = {
  graph: G.Client
  dispatch: T.Dispatch
  q: DocumentNode
  // tslint:disable no-any
  context?: any
  variables?: any
  // tslint:enable no-any
}
export function query<Response>({ graph, dispatch, q, context, variables }: QueryParams): Promise<Response> {
  const id = uuid()
  dispatch({ type: 'QUERY_START', id, query: q })

  return graph.query<Response>({ query: q, context, variables }).then(response => {
    const data = response.data
    dispatch({ type: 'QUERY_SUCCESS', id, data })
    return data
  }).catch(error => {
    dispatch({ type: 'QUERY_ERROR', id, error })
    throw error
  })
}

const fetchViewer = (): Async<void> =>
  (dispatch, getState, { graph }) => {
    const p = getPatch(getState())
    const variables = {
      version: p ? p.sha : undefined
    }

    return query<G.ViewerQuery>({
      graph,
      dispatch,
      q: G.viewer,
      variables
    }).
      then((viewer: G.ViewerQuery) => {
        dispatch({ type: 'LOAD_VIEWER', viewer })
        dispatch({ type: 'CHECK_PROOFS' })
      })
  }

export const boot = () => fetchViewer()

export const serverError = (): Async<void> =>
  (_dispatch, _getState, { graph }) =>
    graph.mutate({
      mutation: G.throwError,
      variables: {
        input: { mesage: '' }
      }
    }).then(() => undefined)

export const changeBranch = (branch: T.BranchName | undefined): Async<void> =>
  (dispatch, getState, { graph }) => {
    dispatch({ type: 'CHANGE_BRANCH', branch })
    dispatch(fetchViewer())
    return Promise.resolve()
  }

const getPatch = (state: T.State): G.PatchInput | undefined => {
  const active = state.version.active
  if (!active) { return }
  const branch = state.version.branches.get(active)!
  return {
    branch: branch.name,
    sha: branch.sha
  }
}

export const login = (token: T.Token): Async<T.User> =>
  (dispatch, _, extra) => {
    const context = {
      headers: {
        authorization: token
      }
    }
    return query<G.MeQuery>({ graph: extra.graph, dispatch, q: G.me, context }).then(data => {
      const user = { name: data.me.name }
      const branches = data.me.branches

      extra.token.set(token)

      const action: Login = {
        type: 'LOGIN',
        token,
        user,
        branches: data.me.branches.map(b => ({
          name: b.name,
          sha: b.sha,
          access: (b.access === 'admin' ? 'admin' : 'read' as T.BranchAccess),
          active: false,
          submitting: false,
          pullRequestUrl: undefined
        }))
      }
      dispatch(action)

      return user
    })
  }

export const logout = (): Async<void> =>
  (dispatch, _, { graph, token }) => {
    token.clear()
    dispatch({ type: 'LOGOUT' })
    dispatch(changeBranch(undefined))
    return Promise.resolve()
  }

export const resetBranch = (branch: T.BranchName, to: T.Sha): Async<void> =>
  (dispatch, _, { graph }) => {
    return graph.mutate({
      mutation: G.resetBranch,
      variables: {
        input: { branch, to }
      }
    }).then(response => {
      dispatch(updateBranch(branch, response.data!.resetBranch.sha))
    })
  }

export const submitBranch = (branch: T.BranchName): Async<void> =>
  (dispatch, _, { graph }) => {
    dispatch({ type: 'SUBMITTING_BRANCH', branch })
    return graph.mutate({
      mutation: G.submitBranch,
      variables: {
        input: { branch }
      }
    }).then(response => {
      const data = (response.data as G.SubmitBranchMutation).submitBranch
      dispatch({ type: 'SUBMITTED_BRANCH', branch, url: data.url })
    })
  }

type PatchParams<V> = {
  before: Action
  mutation: DocumentNode
  variables: V & { patch?: G.PatchInput }
  field?: string
}
function patch<V>({ before, mutation, variables, field }: PatchParams<V>) {
  return (dispatch, getState, { graph }) => {
    const p = getPatch(getState())
    if (!p) { return Promise.resolve() } // FIXME

    dispatch(before)

    // Assume mutation looks like
    // <field> {
    //   version
    //   ...
    // }
    if (!field) {
      const selection = (mutation.definitions[0] as OperationDefinitionNode).selectionSet.selections[0]
      field = (selection as FieldNode).name.value
    }

    variables.patch = p
    return graph.mutate({ mutation, variables }).then(response => {
      const version = response.data![field!].version
      dispatch({ type: 'UPDATE_BRANCH', branch: p.branch, sha: version })
      return response
    })
  }
}

export const assertTrait = (trait: T.Trait): Async<void> =>
  patch<{ trait: G.AssertTraitInput }>({
    before: addTrait(trait),
    mutation: G.assertTrait,
    variables: {
      trait: {
        spaceId: trait.space.uid,
        propertyId: trait.property.uid,
        value: trait.value,
        description: trait.description || ''
      }
    }
  })

const serializeFormula = (f: F.Formula<string>) => JSON.stringify(F.toJSON(f))

export const assertTheorem = (theorem: T.Theorem): Async<void> =>
  patch<{ theorem: G.AssertTheoremInput }>({
    before: addTheorem(theorem),
    mutation: G.assertTheorem,
    variables: {
      theorem: {
        uid: theorem.uid,
        antecedent: serializeFormula(theorem.if),
        consequent: serializeFormula(theorem.then),
        description: theorem.description
      }
    }
  })

export const createSpace = (space: T.Space): Async<void> =>
  patch<{ space: G.CreateSpaceInput }>({
    before: addSpace(space),
    mutation: G.createSpace,
    variables: { space }
  })

export const createProperty = (property: T.Property): Async<void> =>
  patch<{ property: G.CreatePropertyInput }>({
    before: addProperty(property),
    mutation: G.createProperty,
    variables: { property }
  })

export const updateSpace = (space: T.Space): Async<void> =>
  patch<{ space: G.UpdateSpaceInput }>({
    before: addSpace(space),
    mutation: G.updateSpace,
    variables: { space }
  })

export const updateProperty = (property: T.Property): Async<void> =>
  patch<{ property: G.UpdatePropertyInput }>({
    before: addProperty(property),
    mutation: G.updateProperty,
    variables: { property }
  })

export const updateTrait = (trait: T.Trait): Async<void> =>
  patch<{ trait: G.UpdateTraitInput }>({
    before: addTrait(trait),
    mutation: G.updateTrait,
    variables: {
      trait: {
        spaceId: trait.space.uid,
        propertyId: trait.property.uid,
        description: trait.description || ''
      }
    }
  })

export const updateTheorem = (theorem: T.Theorem): Async<void> =>
  patch<{ theorem: G.UpdateTheoremInput }>({
    before: addTheorem(theorem),
    mutation: G.updateTheorem,
    variables: {
      theorem: {
        uid: theorem.uid,
        description: theorem.description
      }
    }
  })