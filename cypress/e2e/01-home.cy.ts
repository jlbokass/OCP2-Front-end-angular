describe('Homepage', () => {
  // @coverage E2E-01
  // @screen /
  it('should expose the main navigation actions', () => {
    cy.visit('/');

    cy.contains('h1', 'Une application simple')
      .should('be.visible');

    cy.contains('a', 'Se connecter')
      .should('have.attr', 'href', '/login');

    cy.contains('a', "S'inscrire")
      .should('have.attr', 'href', '/register');

    cy.contains('a', 'Voir les étudiants')
      .should('have.attr', 'href', '/students');
  });
});
