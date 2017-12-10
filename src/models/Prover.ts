import { Proof, disprove } from '../logic'
import { Formula, Id, Table, Theorem } from '../types'

import * as F from '../models/Formula'

export class Prover {
  traits: Table<Id, Id, boolean>
  theorems: Theorem[]

  constructor(traits: Table<Id, Id, boolean>, theorems: Theorem[]) {
    this.traits = traits
    this.theorems = theorems
  }

  disprove(formula: Formula<Id>): Proof | undefined {
    return disprove(this.theorems, formula)
  }

  prove(theorem: Theorem): Proof | undefined {
    return disprove(this.theorems, F.and(
      theorem.if,
      F.negate(theorem.then)
    ))
  }
}