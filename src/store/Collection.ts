import * as I from 'immutable'
import { action, computed, observable } from 'mobx'

class Collection<Id, X extends { uid: Id }> {
    @observable index: Map<Id, X>

    constructor() {
        this.index = new Map()
    }

    @action add(x: X) {
        this.index.set(x.uid, x)
    }

    @computed get all(): I.List<X> {
        return I.List(this.index.values())
    }

    find(uid: Id) {
        return this.index.get(uid)
    }
}

export default Collection