it('navigates through tab links', () => {
  cy.visit('/spaces/S000001')

  cy.get('h1').contains('Discrete topology on a two-point set or Finite Discrete Topology')
  cy.get('.nav-link.active').contains('Theorems')

  cy.get('.tab-content').contains('counterexample')
  // FIXME: this does not currently re-render as new traits are deduced, so
  // loads empty

  cy.get('.nav-tabs').contains('Properties').click()
  cy.url().should('match', /\/spaces\/S000001\/properties$/)
  cy.get('.tab-content').contains('Finite')
  // FIXME: does not contain derived traits, as above

  cy.get('.nav-tabs').contains('References').click()
  cy.url().should('match', /\/spaces\/S000001\/references$/)
  cy.get('.tab-content').contains('Counterexamples in Topology')
  cy.get('.tab-content').contains('Discrete Space on Wikipedia')
})