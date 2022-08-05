describe('User Auth', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the app root url', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('.menu')
      .should('be.exist')
      .contains('Spatial Audio Player');

    cy.get('.modal')
      .should('be.visible')
      .contains('Sign In');

    cy.get('input[name=login]').focus().type(username);
    cy.get('input[name=password]').focus().type(password);

    cy.get('form').submit();

    cy.get('a.link')
      .click({ multiple: true, execTimeout: 100000000 })
      .should('contain', 'Dashboard')
      .should('contain', 'Spatial Audio Player')
      .should('contain', 'Users')
      .should('contain', 'm1');

    cy.url().should('eq', `${Cypress.config().baseUrl}settings`);
  });
  it('Displays errors on login', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('input[name=login]').focus().type('jane.lae');
    cy.get('input[name=password]').focus().type('password123{enter}');

    cy.get('.notification')
      .should('be.visible')
      .should('have.class', 'pink')
      .and('contain', 'User with such credentials was not found');
  });

  context('Checking on Sign in and Log out', () => {
    it('Displays errors on password', () => {
      cy.visit('/');

      cy.get('.modal').should('not.be.visible');

      cy.get('button.login')
        .should('be.exist')
        .click();

      cy.get('input[name=login]').focus().type('m1');
      cy.get('input[name=password]').focus().type('password123{enter}');

      cy.get('.notification')
        .should('be.visible')
        .should('have.class', 'pink')
        .and('contain', 'Incorrect login or password');
    });
    it('Redirects to "/" on success Sign in', () => {
      cy.visit('/');

      cy.get('.modal').should('not.be.visible');

      cy.get('button.login')
        .should('be.exist')
        .click();

      cy.get('input[name=login]').focus().type('m1');
      cy.get('input[name=password]').focus().type('goodpassbro');
      cy.get('form').submit();

      cy.url().should('include', '/');

      cy.get('.notification')
        .should('be.visible')
        .should('have.class', 'green')
        .and('contain', 'Success! Welcome back, m1');
    });
    it('Log out', () => {
      cy.login(username, password);
      cy.get('button').contains('logout').click({ force: true });
      cy.get('.modal')
        .should('be.visible')
        .contains('Are you sure?');

      cy.get('.modal')
        .find('button[type=button]')
        .first()
        .click({ force: true });

      cy.get('.notification')
        .should('be.visible')
        .should('have.class', 'green')
        .and('contain', 'Log out success! See you later ;)');
    });
  });
});
