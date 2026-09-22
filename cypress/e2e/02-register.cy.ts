describe('Registration', () => {
  // @screen /register

  // @coverage E2E-02
  it('should register an agent and navigate to login', () => {
    cy.intercept(
      'POST',
      '/api/register',
      (request) => {
        expect(request.body).to.deep.equal({
          firstName: 'Ada',
          lastName: 'Lovelace',
          login: 'ada',
          password: 'password'
        });

        request.reply({
          statusCode: 201,
          body: {}
        });
      }
    ).as('register');

    cy.visit('/register');

    cy.get('[formControlName="firstName"]')
      .type('Ada');

    cy.get('[formControlName="lastName"]')
      .type('Lovelace');

    cy.get('[formControlName="login"]')
      .type('ada');

    cy.get('[formControlName="password"]')
      .type('password');

    cy.contains('button', 'Register')
      .click();

    cy.wait('@register');

    cy.location('pathname')
      .should('eq', '/login');
  });

  // @coverage E2E-03
  it('should keep an invalid registration form client-side', () => {
    let apiCalls = 0;

    cy.intercept(
      'POST',
      '/api/register',
      (request) => {
        apiCalls += 1;

        request.reply({
          statusCode: 201,
          body: {}
        });
      }
    );

    cy.visit('/register');

    cy.contains('button', 'Register')
      .click();

    cy.get('.is-invalid')
      .should('have.length', 4);

    cy.location('pathname')
      .should('eq', '/register');

    cy.then(() => {
      expect(apiCalls).to.eq(0);
    });
  });
});
