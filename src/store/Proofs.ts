import { observable } from 'mobx'

import * as T from '../types'

class Proofs {
    @observable map: Map<string, T.Proof>

    constructor() {
        this.map = new Map()
    }

    find(spaceId: T.Id, propertyId: T.Id): T.Proof | undefined {
        return this.map.get(this.key(spaceId, propertyId))
    }

    for(trait: T.Trait): T.Proof | undefined {
        return this.find(trait.space.uid, trait.property.uid)
    }

    record(space: T.Id, property: T.Id, proof: T.Proof) {
        this.map.set(this.key(space, property), proof)
    }

    key(space: T.Id, property: T.Id) {
        return `${space}:${property}`
    }
}

export default Proofs