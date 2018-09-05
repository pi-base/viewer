import * as F from './models/Formula'
import * as G from './graph'
import * as T from './types'

import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql'

import { ThunkAction } from 'redux-thunk'
import { getPatch } from './queries'
import uuid from 'uuid/v4'

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

const submittingBranch = (branch: T.Branch): Action => ({
  type: 'SUBMITTING_BRANCH', branch
})
const submittedBranch = ({ branch, url }: { branch: T.Branch, url: string }): Action => ({
  type: 'SUBMITTED_BRANCH', branch, url
})

type Async<R> = ThunkAction<
  Promise<R>,
  T.State,
  { graph: G.Client, token: T.TokenStorage },
  Action
  >

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

export const changeBranch = (branch: T.BranchName | undefined): Async<void> =>
  (dispatch, getState, { graph }) => {
    dispatch({ type: 'CHANGE_BRANCH', branch })
    dispatch(fetchViewer())
    return Promise.resolve()
  }

export const login = (token: T.Token): Async<T.User> =>
  (dispatch, _, extra) => {
    const context = {
      headers: {
        Authorization: `Bearer ${token}`
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

export const submitBranch = (branch: T.Branch): Async<void> =>
  (dispatch, _, { graph }) => {
    dispatch({ type: 'SUBMITTING_BRANCH', branch })
    const input: G.BranchInput = {
      branch: branch.name
    }
    return graph.mutate<G.SubmitBranchMutation>({
      mutation: G.submitBranch,
      variables: { input }
    }).then(response => {
      const data = response.data!.submitBranch
      dispatch({ type: 'SUBMITTED_BRANCH', branch, url: data.url })
    })
  }

type PatchParams<Variables = {}> = {
  mutation: DocumentNode
  variables: Variables & { patch?: G.PatchInput }
  field?: string,
}
function patch<Variables, Response>({ mutation, variables, field }: PatchParams<Variables>): Async<Response> {
  return (dispatch, getState, { graph }) => {
    const p = getPatch(getState())
    if (!p) { return Promise.resolve() } // FIXME

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
      const data = response.data!
      const version = data[field!].version
      dispatch({ type: 'UPDATE_BRANCH', branch: p.branch, sha: version })
      // tslint:disable-next-line no-any
      return data as any
    })
  }
}

interface PutParams<Object, Input, Response> {
  mutation: DocumentNode
  variables: Input
  build: (response: Response) => Object
  save: (result: Object) => Action
}
const put = <Object, Input, Response>({ mutation, variables, build, save }: PutParams<Object, Input, Response>) =>
  (dispatch, getState, extra) => {
    return patch<Input, Response>({
      mutation,
      variables
    })(dispatch, getState, extra).then(response => {
      const result = build(response)
      dispatch(save(result))
      return result
    })
  }

export const assertTrait = (trait: T.Trait): Async<T.Trait> =>
  put<T.Trait, { trait: G.AssertTraitInput }, G.AssertTraitMutation>({
    mutation: G.assertTrait,
    variables: {
      trait: {
        spaceId: trait.space.uid,
        propertyId: trait.property.uid,
        value: trait.value,
        description: trait.description,
        references: trait.references
      }
    },
    build: _ => trait,
    save: addTrait
  })

const serializeFormula = (f: F.Formula<string>): string => JSON.stringify(F.toJSON(f))

export const assertTheorem = (theorem: T.Theorem): Async<T.Theorem> =>
  put<T.Theorem, { theorem: G.AssertTheoremInput }, G.AssertTheoremMutation>({
    mutation: G.assertTheorem,
    variables: {
      theorem: {
        antecedent: serializeFormula(theorem.if),
        consequent: serializeFormula(theorem.then),
        description: theorem.description,
        references: theorem.references
      }
    },
    build: response => {
      const uid = response.assertTheorem.theorems[0].uid
      return { uid, ...theorem }
    },
    save: addTheorem
  })

export const createSpace = (space: T.Space): Async<T.Space> =>
  put<T.Space, { space: G.CreateSpaceInput }, G.CreateSpaceMutation>({
    mutation: G.createSpace,
    variables: { space },
    build: response => ({ uid: response.createSpace.spaces[0].uid, ...space }),
    save: addSpace
  })

export const createProperty = (property: T.Property): Async<T.Property> =>
  put<T.Property, { property: G.CreatePropertyInput }, G.CreatePropertyMutation>({
    mutation: G.createProperty,
    variables: { property },
    build: response => {
      const uid = response.createProperty.properties[0].uid
      return { uid, ...property }
    },
    save: addProperty
  })

export const updateSpace = (space: T.Space): Async<T.Space> =>
  put<T.Space, { space: G.UpdateSpaceInput }, G.UpdateSpaceMutation>({
    mutation: G.updateSpace,
    variables: { space },
    build: _ => space,
    save: addSpace
  })

export const updateProperty = (property: T.Property): Async<T.Property> =>
  put<T.Property, { property: G.UpdatePropertyInput }, G.UpdatePropertyMutation>({
    mutation: G.updateProperty,
    variables: { property },
    build: _ => property,
    save: addProperty
  })

export const updateTrait = (trait: T.Trait): Async<T.Trait> =>
  put<T.Trait, { trait: G.UpdateTraitInput }, G.UpdateTraitMutation>({
    mutation: G.updateTrait,
    variables: {
      trait: {
        spaceId: trait.space.uid,
        propertyId: trait.property.uid,
        description: trait.description,
        references: trait.references
      }
    },
    build: _ => trait,
    save: addTrait
  })

export const updateTheorem = (theorem: T.Theorem): Async<T.Theorem> =>
  put<T.Theorem, { theorem: G.UpdateTheoremInput }, G.UpdateTheoremMutation>({
    mutation: G.updateTheorem,
    variables: {
      theorem: {
        uid: theorem.uid,
        description: theorem.description,
        references: theorem.references
      }
    },
    build: _ => theorem,
    save: addTheorem
  })