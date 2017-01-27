export const parseSearchFormula = (state, q) => {
    console.log('parseSearchFormula state', state)
    return { parsed: q }
}

export const runSearch = (state, formula) => {
    console.log('runSearch state', state)
    return [
        'hardcoded',
        formula.parsed
    ]
}
