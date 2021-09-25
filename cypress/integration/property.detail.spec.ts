it('navigates through links', () => {
  cy.visit('/properties')

  cy.get('tbody > tr:first > td:first').contains('1').click()

  cy.url().should('match', /\/properties\/P000001$/)
  cy.get('h1').contains('Kolmogorov')
  cy.get('.tab-content').contains('Sober')

  cy.get('.nav-tabs').contains('Spaces').click()
  cy.url().should('match', /\/properties\/P000001\/spaces$/)
  cy.get('.tab-content').contains('Indiscrete Topology')

  cy.get('.nav-tabs').contains('References').click()
  cy.url().should('match', /\/properties\/P000001\/references$/)
  cy.get('.tab-content').contains('Counterexamples in Topology')
})