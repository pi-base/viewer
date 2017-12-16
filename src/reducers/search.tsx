import { Action } from '../actions'
import { State as RootState } from '../reducers'
import { parseFormula } from '../selectors'
import { Formula, Id } from '../types'

export type State = {
  text: string
  formula: string
  formulaMemo: Formula<Id> | undefined
}

export const initial: State = {
  text: '',
  formula: '',
  formulaMemo: undefined
}

export const reducer = (
  state: RootState,
  action: Action
): State => {
  switch (action.type) {
    case 'SEARCH':
      const next = Object.assign({}, state.search)
      if (action.text !== undefined) {
        next.text = action.text
      }
      if (action.formula !== undefined) {
        next.formula = action.formula
        const parsed = parseFormula(state, action.formula)
        if (parsed || action.formula === '') { next.formulaMemo = parsed }
      }
      return next
    default:
      return state.search
  }
}

export default reducer