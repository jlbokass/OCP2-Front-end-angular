import {
  TEST_TOKEN,
  visitAuthenticated
} from '../support/auth';

describe('Student screens', () => {
  // @coverage E2E-06
  it('should redirect an unauthenticated visitor to login', () => {
    cy.visit('/students');

    cy.location('pathname')
      .should('eq', '/login');
  });

  // @coverage E2E-07
  // @screen /students
  it('should display the student list', () => {
    cy.intercept(
      'GET',
      '/api/students',
      (request) => {
        expect(request.headers.authorization)
          .to.eq(`Bearer ${TEST_TOKEN}`);

        request.reply({
          statusCode: 200,
          body: [
            {
              id: 1,
              firstName: 'Ada',
              lastName: 'Lovelace'
            },
            {
              id: 2,
              firstName: 'Alan',
              lastName: 'Turing'
            }
          ]
        });
      }
    ).as('students');

    visitAuthenticated('/students');

    cy.wait('@students');

    cy.contains('Ada').should('be.visible');
    cy.contains('Lovelace').should('be.visible');
    cy.contains('Alan').should('be.visible');
    cy.contains('Turing').should('be.visible');
  });

  // @coverage E2E-08
  // @screen /students/new
  it('should create a student and open its detail', () => {
    const createdStudent = {
      id: 3,
      firstName: 'Grace',
      lastName: 'Hopper'
    };

    cy.intercept(
      'POST',
      '/api/students',
      (request) => {
        expect(request.headers.authorization)
          .to.eq(`Bearer ${TEST_TOKEN}`);

        expect(request.body).to.deep.equal({
          firstName: 'Grace',
          lastName: 'Hopper'
        });

        request.reply({
          statusCode: 201,
          body: createdStudent
        });
      }
    ).as('createStudent');

    cy.intercept(
      'GET',
      '/api/students/3',
      {
        statusCode: 200,
        body: createdStudent
      }
    ).as('studentDetail');

    visitAuthenticated('/students/new');

    cy.get('[formControlName="firstName"]')
      .type('Grace');

    cy.get('[formControlName="lastName"]')
      .type('Hopper');

    cy.contains('button', 'Ajouter')
      .click();

    cy.wait('@createStudent');
    cy.wait('@studentDetail');

    cy.location('pathname')
      .should('eq', '/students/3');

    cy.contains('h1', 'Grace Hopper')
      .should('be.visible');
  });

  // @coverage E2E-09
  // @screen /students/:id
  it('should display a student detail', () => {
    cy.intercept(
      'GET',
      '/api/students/1',
      (request) => {
        expect(request.headers.authorization)
          .to.eq(`Bearer ${TEST_TOKEN}`);

        request.reply({
          statusCode: 200,
          body: {
            id: 1,
            firstName: 'Ada',
            lastName: 'Lovelace'
          }
        });
      }
    ).as('studentDetail');

    visitAuthenticated('/students/1');

    cy.wait('@studentDetail');

    cy.contains('h1', 'Ada Lovelace')
      .should('be.visible');

    cy.contains('a', 'Modifier')
      .should('have.attr', 'href', '/students/1/edit');

    cy.contains('button', 'Supprimer')
      .should('be.visible');
  });

  // @coverage E2E-10
  // @screen /students/:id/edit
  it('should edit a student and return to its detail', () => {
    let student = {
      id: 1,
      firstName: 'Ada',
      lastName: 'Lovelace'
    };

    cy.intercept(
      'GET',
      '/api/students/1',
      (request) => {
        request.reply({
          statusCode: 200,
          body: student
        });
      }
    ).as('studentDetail');

    cy.intercept(
      'PUT',
      '/api/students/1',
      (request) => {
        expect(request.headers.authorization)
          .to.eq(`Bearer ${TEST_TOKEN}`);

        expect(request.body).to.deep.equal({
          firstName: 'Augusta Ada',
          lastName: 'Lovelace'
        });

        student = {
          id: 1,
          ...request.body
        };

        request.reply({
          statusCode: 200,
          body: student
        });
      }
    ).as('updateStudent');

    visitAuthenticated('/students/1/edit');

    cy.wait('@studentDetail');

    cy.get('[formControlName="firstName"]')
      .clear()
      .type('Augusta Ada');

    cy.contains('button', 'Enregistrer')
      .click();

    cy.wait('@updateStudent');
    cy.wait('@studentDetail');

    cy.location('pathname')
      .should('eq', '/students/1');

    cy.contains('h1', 'Augusta Ada Lovelace')
      .should('be.visible');
  });

  // @coverage E2E-11
  it('should delete a student and return to the list', () => {
    cy.intercept(
      'GET',
      '/api/students/1',
      {
        statusCode: 200,
        body: {
          id: 1,
          firstName: 'Ada',
          lastName: 'Lovelace'
        }
      }
    ).as('studentDetail');

    cy.intercept(
      'DELETE',
      '/api/students/1',
      (request) => {
        expect(request.headers.authorization)
          .to.eq(`Bearer ${TEST_TOKEN}`);

        request.reply({
          statusCode: 204
        });
      }
    ).as('deleteStudent');

    cy.intercept(
      'GET',
      '/api/students',
      {
        statusCode: 200,
        body: [
          {
            id: 2,
            firstName: 'Alan',
            lastName: 'Turing'
          }
        ]
      }
    ).as('students');

    visitAuthenticated('/students/1');

    cy.wait('@studentDetail');

    cy.on('window:confirm', () => true);

    cy.contains('button', 'Supprimer')
      .click();

    cy.wait('@deleteStudent');
    cy.wait('@students');

    cy.location('pathname')
      .should('eq', '/students');

    cy.get('tbody tr')
      .should('have.length', 1)
      .first()
      .within(() => {
        cy.contains('td', 'Alan')
          .should('be.visible');

        cy.contains('td', 'Turing')
          .should('be.visible');
      });

    cy.get('tbody')
      .should('not.contain.text', 'Ada')
      .and('not.contain.text', 'Lovelace');
  });
});
