describe('Smoke test', () => {
  it('Can search and find spaces', () => {
    cy.visit('/')

    cy.contains('Spaces').click()
    cy.contains('~metrizable').click()
    cy.contains('Lexicographic unit square', { timeout: 30000 }).click()
    cy.contains('order topology')
  })

  it('Can explore implications between theorems', () => {
    cy.visit('/')

    cy.contains('Properties').click()
    cy.get('input').type('metr')
    cy.contains('Metrizable')
    cy.contains('Submetrizable')
    cy.contains('53').click() // metrizable property id

    cy.contains('Metrizable')
    cy
      .get('.tab-content')
      .contains('10')  // extremally disconnected + metrizable => discrete theorem id
      .click()

    cy.contains('The converse holds')
    cy.contains('44')
    cy.contains('77')
    cy.contains('85')
  })

  it('Has expected derivations in the dev page', () => {
    cy.visit('/dev')

    cy.get('.toast').should('be.visible')
    cy.get('.toast', { timeout: 30000 }).should('not.exist')

    // HACK: we probably want to update this to use test-id selectors, but for
    // now want a regression test that can run against current prod without
    // making any changes there
    cy.get('.row:first > .col:nth-child(2) > .table tr').should($rows => {
      const text = $rows.text()

      const match = text.match(/Checked(?<checked>\d+)Traits(?<traits>\d+)/i)
      const groups = match?.groups || {}

      expect(Number(groups.checked)).to.be.greaterThan(135)
      expect(Number(groups.traits)).to.be.greaterThan(10_000)
    })
  })
})