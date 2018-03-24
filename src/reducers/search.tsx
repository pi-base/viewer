import { Action } from '../actions'
import { State as RootState } from '../reducers'
import { parseFormula } from '../selectors'
import { Formula, Id, SearchModifier } from '../types'

export type State = {
  text: string
  formula: string
  formulaMemo: Formula<Id> | undefined
  modifier: SearchModifier
}

export const initial: State = {
  text: '',
  formula: '',
  formulaMemo: undefined,
  modifier: 'true'
}

const splitModifier = (formula): { formula: string, modifier: SearchModifier } => {
  if (formula.startsWith('!!')) {
    return { modifier: 'not_false', formula: formula.slice(2) }
  } else if (formula.startsWith('!')) {
    return { modifier: 'false', formula: formula.slice(1) }
  } else if (formula.startsWith('?')) {
    return { modifier: 'unknown', formula: formula.slice(1) }
  } else {
    return { modifier: 'true', formula: formula.slice(1) }
  }
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
        const { modifier, formula } = splitModifier(action.formula)
        next.modifier = modifier
        const parsed = parseFormula(state, formula)
        if (parsed || action.formula === '') { next.formulaMemo = parsed }
      }
      return next
    default:
      return state.search
  }
}

export default reducer