import * as Formula from './models/Formula'


const matches = (traits, formula) => (true)

const findAll = (hash, keys) => {
  let results = []
  for (let key in keys) {
    results.push(hash[key])
  }
  return results
}

export const parseSearchFormula = (state, q) => {
    const parsed = Formula.parse(q)
    if (!parsed) { return }

    const formula = parsed
    // TODO: hydrate with property objects / show error if not found
    return formula
}

export const runSearch = (state, formula) => {
    const resolved = formula.mapProperty(p => state.properties.finder.resolve(p))
    console.log('resolved', resolved);
    // TODO: what about properties that aren't found?
    let spaceIds = []
    for (let spaceId in state.traits) {
      if (matches(state.traits[spaceId], resolved)) {
        spaceIds.push(spaceId)
      }
    }
    return findAll(state.spaces, spaceIds)
}

export const searchQ = (state) => (state.search.q)
export const searchFormula = (state) => (state.search.formula)
export const searchResults = (state) => (['TODO'])
