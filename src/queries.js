 import * as Formula from './models/Formula'

 const matches = (formula, traits) => {
   return formula.check((prop, targetValue) => {
     const t = traits[prop.id]
     return t && t.value === targetValue
   })
 }

 const findAll = (coll, ids) => {
   return ids.map((id) => {
     let name = coll.getIn(['entities', id])
     return {
       id: id,
       name: name
     }
   })
 }

 export const parseSearchFormula = (state, q) => {
   const parsed = Formula.parse(q)
   if (!parsed) {
     return
   }

   const finder = state.getIn(['properties', 'finder'])
   const formula = parsed.mapProperty(p => finder.resolve(p))
   // TODO: show error if properties not found

   return formula
 }

 export const searchFormula = (state) => (state.getIn(['search', 'formula']))

 export const runSearch = (state, formula) => {
   const spaceIds = state.get('traits').filter((traits) => {
     return matches(formula, traits)
   }).keySeq()

   return findAll(state.get('spaces'), spaceIds)
 }

 export const searchQ = (state) => (state.getIn(['search', 'q']))


 const getFragment = (str) => {
   if (!str) {
     return ''
   }
   const parts = str.split(/[~+&|\(\)]/)
   return parts[parts.length - 1].trim()
 }

 export const suggestionsFor = (state, query) => {
   const finder = state.getIn(['properties', 'finder'])
   if (!(query && finder)) {
     return []
   }

   return finder.suggestionsFor(getFragment(query))
 }

 export const spaceTraitFilter = (state) => (
   state.getIn(['spaces', 'traitFilter']) || ''
 )

 export const filteredTraitsForSpace = (state, space, filter) => {
   const traits = state.getIn(['traits', space.uid])
   const finder = state.getIn(['properties', 'finder'])

   if (!traits || !finder) {
     return []
   }

   const suggs = finder.suggestionsFor(filter)
   let result = []

   suggs.forEach((sug) => {
     let trait = traits[sug.id]
     if (!trait) {
       return
     }

     result.push({
       property: sug,
       value: trait.value,
       deduced: trait.deduced
     })
   })

   return result
 }
