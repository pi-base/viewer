import * as Formula from './formula'

export const parseSearchFormula = (state, q) => {
    const parsed = Formula.parse(q)
    if (!parsed) { return }

    const formula = parsed // TODO: hydrate with property objects / show error if not found
    return formula
}

export const runSearch = (state, formula) => {
    console.log('runSearch state', state)
    return [
        'hardcoded',
        formula.parsed
    ]
}

export const searchQ = (state) => (state.search.q)
export const searchFormula = (state) => (state.search.formula)
export const searchResults = (state) => (['TODO'])
