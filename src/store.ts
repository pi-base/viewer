import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import ApolloClient from 'apollo-client'

type State = {}

export const makeStore = (client: ApolloClient, initialState?: State) => {
    initialState = initialState || {}

    return createStore(
        combineReducers({
          apollo: client.reducer()
        }),
        initialState,
        compose(
            applyMiddleware(client.middleware())
            // If you are using the devToolsExtension, you can add it here also
            // (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ?
            //   window.__REDUX_DEVTOOLS_EXTENSION__() : f => f,
        )
    )
}