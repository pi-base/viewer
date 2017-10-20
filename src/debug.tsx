import * as React from 'react'

import { Store } from 'react-redux'

export default function Debug(store: Store) {
    const pibase = {
        error() {
            return ('' as any).floop('')
        },
        store: store
    }

    if (process.env.NODE_ENV === 'development') {
        Object.assign(window, pibase)
    } else {
        (window as any)._pi_base = pibase
    }

    return null
}
