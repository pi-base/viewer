import { Store } from 'react-redux'

export default function (store: Store) {
    const pibase = {
        error() {
            return ('' as any).floop('')
        },
        state() {
            return store.getState()
        }
    }

    if (process.env.NODE_ENV === 'development') {
        Object.assign(window, pibase)
    } else {
        (window as any)._pi_base = pibase
    }
}
