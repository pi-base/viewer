import * as I from 'immutable'

import * as A from '../actions'
import * as F from '../models/Formula'
import * as T from '../types'

import { mobxStore } from '../store'

type Formula = F.Formula<T.Id>
type Space = { uid: T.Id, name: string }
type Property = { uid: T.Id, name: string }
type Theorem = { uid: T.Id, if: Formula, then: Formula }

export interface State {
    branch: string | undefined,
    version: string | undefined
    spaces: T.Index<Space>
    properties: T.Index<Property>
    theorems: T.Index<Theorem>
    traits: I.Map<T.Id, I.Map<T.Id, boolean>> // space, property
}

const initialState: State = {
    branch: undefined,
    version: undefined,
    spaces: I.Map(),
    properties: I.Map(),
    theorems: I.Map(),
    traits: I.Map()
}

function reducer(previous: State = initialState, action: A.Action): State {
    switch (action.type) {
        case 'CHANGE_BRANCH':
            return { ...initialState, branch: action.branch }
        case 'UPDATE_VERSION':
            return { ...previous, version: action.version }
        case 'LOADED_VIEW':
            const properties = previous.properties.withMutations(ps => {
                (action.view.properties || []).forEach(p => {
                    ps.set(p.uid, { uid: p.uid, name: p.name })
                })
            })

            let spaces
            const traits = previous.traits.withMutations(ts => {
                spaces = previous.spaces.withMutations(ss => {
                    (action.view.spaces || []).forEach(s => {
                        ss.set(s.uid, { uid: s.uid, name: s.name });
                        (s.traits || []).forEach(t => {
                            ts.setIn([s.uid, t.property.uid], t.value)
                        })
                    })
                })
            })

            const theorems = previous.theorems.withMutations(ts => {
                (action.view.theorems || []).forEach(t => {
                    ts.set(t.uid, {
                        uid: t.uid,
                        if: F.fromJSON(JSON.parse(t.if)),
                        then: F.fromJSON(JSON.parse(t.then))
                    })
                })
            })

            return {
                ...previous,
                properties,
                spaces,
                traits,
                theorems,
                version: action.view.version
            }
        default:
            return previous
    }
}

export default reducer