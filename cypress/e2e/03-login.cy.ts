describe('Login', () => {
  // @screen /login

  // @coverage E2E-04
  it('should authenticate, store the token and navigate to students', () => {
    cy.intercept(
      'POST',
      '/api/login',
      (request) => {
        expect(request.body).to.deep.equal({
          login: 'agent',
          password: 'password'
        });

        request.reply({
          statusCode: 200,
          body: {
            token: 'JWT_TOKEN'
          }
        });
      }
    ).as('login');

    cy.intercept(
      'GET',
      '/api/students',
      (request) => {
        expect(request.headers.authorization)
          .to.eq('Bearer JWT_TOKEN');

        request.reply({
          statusCode: 200,
          body: []
        });
      }
    ).as('students');

    cy.visit('/login');

    cy.get('[formControlName="login"]')
      .type('agent');

    cy.get('[formControlName="password"]')
      .type('password');

    cy.contains('button', 'Se connecter')
      .click();

    cy.wait('@login');
    cy.wait('@students');

    cy.location('pathname')
      .should('eq', '/students');

    cy.window()
      .its('sessionStorage')
      .invoke('getItem', 'token')
      .should('eq', 'JWT_TOKEN');
  });

  // @coverage E2E-05
  it('should display an error when credentials are invalid', () => {
    cy.intercept(
      'POST',
      '/api/login',
      {
        statusCode: 401,
        body: {
          message: 'Invalid credentials'
        }
      }
    ).as('login');

    cy.visit('/login');

    cy.get('[formControlName="login"]')
      .type('agent');

    cy.get('[formControlName="password"]')
      .type('wrong-password');

    cy.contains('button', 'Se connecter')
      .click();

    cy.wait('@login');

    cy.contains(
      'Identifiant ou mot de passe incorrect.'
    ).should('be.visible');

    cy.location('pathname')
      .should('eq', '/login');
  });
});
