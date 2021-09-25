it('renders the page', () => {
  cy.visit('/theorems')

  cy.get('tbody > tr:first > td:first').should('have.text', '1')
})

it('can filter', () => {
  cy.visit('/theorems')

  cy.get('[placeholder="Filter"]').type('comp')

  cy.url().should('include', '?filter=comp')
  cy.get('tbody > tr:first > td:first').should('have.text', '163')
})

it('populates the filter from query params', () => {
  cy.visit('/theorems?filter=conn')

  cy.get('[placeholder="Filter"]').should('have.value', 'conn')
  cy.get('tbody > tr:first > td:first').should('have.text', '64')
})

// FIXME: this appears to have a race condition
it.skip('can sort on id', () => {
  cy.visit('/theorems?filter=conn')

  // FIXME: derivation resets filter state, so we need to let it finish
  cy.get('.toast').should('be.visible')
  cy.get('.toast', { timeout: 30000 }).should('not.exist')

  cy.contains('Id').click()

  cy.get('tbody > tr:first > td:first').should('have.text', '3')
})