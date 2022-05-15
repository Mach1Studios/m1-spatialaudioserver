describe('Auth', () => {
  it('Visits the app root url', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('.modal')
      .should('be.visible')
      .contains('Sign In');
    cy.get('input[name=login]').type('m1');
    cy.get('input[name=password]').type('goodpassbro');
    cy.get('form').submit();
  });
  it('displays errors on login', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('input[name=login]').type('jane.lae');
    cy.get('input[name=password]').type('password123{enter}');

    cy.get('.notification')
      .should('be.visible')
      .and('contain', 'User with such credentials was not found');
  });
  it('redirects to " / " on success', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('input[name=login]').type('m1');
    cy.get('input[name=password]').type('goodpassbro');
    cy.get('form').submit();

    cy.url().should('include', '/');

    cy.get('.notification')
      .should('be.visible')
      .and('contain', 'Success! Welcome back, m1');
  });
  it('displays errors on password', () => {
    cy.visit('/');

    cy.get('.modal').should('not.be.visible');

    cy.get('button.login')
      .should('be.exist')
      .click();

    cy.get('input[name=login]').type('m1');
    cy.get('input[name=password]').type('password123{enter}');

    cy.get('.notification')
      .should('be.visible')
      .and('contain', 'Incorrect login or password');
  });
});
