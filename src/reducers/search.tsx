import { Action } from '../actions'
import { State as RootState } from '../reducers'
import { parseFormula } from '../selectors'
import { Formula, Id } from '../types'

export type State = {
  text: string | undefined
  formula: Formula<Id> | undefined
}

export const initial: State = { text: undefined, formula: undefined }

export const reducer = (
  state: RootState,
  action: Action
): State => {
  switch (action.type) {
    case 'SEARCH':
      const next = Object.assign({}, state.search)
      if (action.formula) {
        const formula = parseFormula(state, action.formula)
        if (formula) { next.formula = formula }
      }
      if (action.text) { next.text = action.text }
      return next
    default:
      return state.search
  }
}

export default reducer