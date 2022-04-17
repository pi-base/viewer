it('can apply the given suggestions', () => {
  runProofs()

  cy.contains('~metrizable').click()

  cy.get('.suggestions').should('not.exist')
  cy.contains('Lexicographic unit square')
})

it.skip('uses suggestions to search by properties', () => {
  runProofs()

  cy.get('[name="q"]').type('norm')
  cy.get('.suggestions').contains('Perfectly normal').click()

  cy.get('h5').should('have.text',
    // FIXME: this appears not to re-draw correctly
    // 'Spaces\n      satisfying Perfectly normal',
    'Spaces\n      satisfying Normal')
  cy.get('table thead').should('have.text', ' Perfectly normal ')
})

it.skip('can navigate directly to a link containing a search', () => {
  // This runs into the same test loading issue as below
  cy.visit('/spaces?text=square&formula=compact')

  // Should prepopulate form fields
  // Should not display suggestions
})

function runProofs() {
  cy.visit('/')

  // FIXME: these displays are _not_ reactive as new proofs are added, so we
  // have to ensure that all proofs are derived before running each test
  //
  // Once these are reactive, we should be able to remove this wait, and allow
  // the matchers to pass once the expected element is present
  cy.get('.toast').should('be.visible')
  cy.get('.toast', { timeout: 30000 }).should('not.exist')

  cy.contains('Spaces').click()
}
