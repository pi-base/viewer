it('navigates through links', () => {
  cy.visit('/theorems')

  cy.get('tbody > tr:first > td:first').contains('1').click()
  cy.url().should('match', /\/theorems\/T000001$/)
  cy.contains('The converse does not hold')

  cy.contains('References').click()
  cy.url().should('match', /\/theorems\/T000001\/references$/)
  cy.contains('Counterexamples in Topology')

  cy.contains('References').click()
  cy.url().should('match', /\/theorems\/T000001\/converse$/)
})

it('navigates direct to references', () => {
  cy.visit('/theorems/T000002/references')
  cy.contains('Counterexamples in Topology')
})

it('displays converses that hold', () => {
  cy.visit('/theorems/T000025/converse')
  cy.contains('The converse holds')
  cy.contains('31')
})

it.only('displays cases where the converse is not provable', () => {
  cy.visit('/theorems/T000067/converse')
  cy.contains('Could not find any counterexamples to the converse')
})