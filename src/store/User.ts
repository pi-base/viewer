import { computed, observable } from 'mobx'
import { ApolloClient } from 'apollo-client'

class User {
    @observable name: string

    apollo: ApolloClient

    constructor(apollo: ApolloClient) {
        this.apollo = apollo
    }

    @computed get current() {
        return { name: this.name }
    }
}

export default User