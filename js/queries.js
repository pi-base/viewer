import * as Formula from './models/Formula'


const matches = (traits, formula) => {
  return formula.check((prop, targetValue) => {
    let realValue = traits[prop.id]

    return targetValue === realValue
  })
}

const findAll = (hash, keys) => {
  let results = []
  for (let key in keys) {
    let found = hash[key]
    if (found) {
      results.push({
        id:   key,
        name: hash[key]
      })
    } // TODO: else?
  }
  return results
}

export const parseSearchFormula = (state, q) => {
    const parsed = Formula.parse(q)
    if (!parsed) { return }

    const formula = parsed.mapProperty(p => state.properties.finder.resolve(p))
    // TODO: show error if properties not found

    return formula
}

export const runSearch = (state, formula) => {
    formula = formula || searchFormula(state)

    let spaceIds = []
    for (let spaceId in state.traits) {
      if (matches(state.traits[spaceId], formula)) {
        spaceIds.push(spaceId)
      }
    }

    return findAll(state.spaces, spaceIds)
}

export const searchQ = (state) => (state.search.q)
export const searchFormula = (state) => (state.search.formula)
