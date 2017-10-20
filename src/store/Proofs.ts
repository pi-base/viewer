import { observable } from 'mobx'

import * as T from '../types'

class Proofs {
    @observable map: Map<[T.Id, T.Id], T.Proof>

    find(spaceId: T.Id, propertyId: T.Id): T.Proof | undefined {
        return this.map.get([spaceId, propertyId])
    }

    for(trait: T.Trait): T.Proof | undefined {
        return this.find(trait.space.uid, trait.property.uid)
    }
}

export default Proofs