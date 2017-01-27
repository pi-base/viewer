export const search = (q) => ({
    type: '@@redux-form/CHANGE',
    meta: { field: 'q', form: 'search' },
    payload: q
})
