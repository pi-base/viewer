describe('Loading', () => {
  it('saves derived traits to local storage', () => {
    cy.intercept(
      { method: 'GET', hostname: 'pi-base-bundles.s3.us-east-2.amazonaws.com' },
      { fixture: 'main.min.json' }
    ).as('bundle')

    cy.visit('/')

    cy.window().clearLocalStorage()
    cy.window().then(w => {
      const bundle = JSON.parse(w.localStorage.getItem('pibase.bundle'))
      expect(bundle).to.eql(null)
    })

    // Wait for deductions to finish
    // TODO: signal this by updating the window / DOM?
    cy.get('.toast').should('be.visible')
    cy.get('.toast', { timeout: 30000 }).should('not.exist')

    // Wait for debounced save
    cy.wait(2000)

    cy.window().then(w => {
      const bundle = JSON.parse(w.localStorage.getItem('pibase.bundle'))
      expect(bundle.checked.length).to.eq(137)

      cy.fixture('main.min.storage.json').then(storage => {
        expect(bundle.spaces).to.eq(storage.spaces)
        expect(bundle.properties).to.eq(storage.properties)
        expect(bundle.theorems).to.eq(storage.theorems)
        expect(bundle.traits).to.eq(storage.traits)
      })
    })
  })

  it('loads from local storage, even if the network is down', () => {
    cy.window().then(w => {
      cy.fixture('main.min.storage.json').then(storage => {
        w.localStorage.setItem('pibase.bundle', JSON.stringify(storage))
      })
    })

    cy.visit('/properties')

    cy.contains('Locally Compact', { timeout: 100 })
  })

  it('handles network errors on initial load')
})