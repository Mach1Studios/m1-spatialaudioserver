describe('Profile', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the profile root url', () => {
    cy.login(username, password);
    cy.visit('/settings');
    cy.url().should('eq', `${Cypress.config().baseUrl}settings`);
  });

  it('Change user name in profile settings', () => {
    cy.login(username, password);
    cy.visit('/settings');
    cy.url().should('eq', `${Cypress.config().baseUrl}settings`);

    cy.get('form').should('be.exist');
    cy.get('input[name=nickname]').focus().type('m2');
    cy.get('button[type=button]').contains('change username').click({ force: true });
    cy.get('form').submit();
  });
  it('Change password in profile settings', () => {
    cy.login(username, password);
    cy.visit('/settings');
    cy.url().should('eq', `${Cypress.config().baseUrl}settings`);

    cy.get('form').should('be.exist');
    cy.get('.label').contains('Old password').prev('input[name=password]').focus()
      .type('goodpassbro');
    cy.get('.label').contains('New password').prev('input[name=password]').focus()
      .type('12345678');
    cy.get('.label').contains('Repeat new password').prev('input[name=password]').focus()
      .type('12345678');
    cy.get('button[type=button]').contains('change password').click({ force: true });
    cy.get('form').submit();
  });
  it('Check links on social media', () => {
    cy.login(username, password);
    cy.visit('/settings');
    cy.url().should('eq', `${Cypress.config().baseUrl}settings`);

    cy.get('a[href="https://www.instagram.com/poweredbymach1/"]');
    cy.get('a[href="https://www.twitter.com/poweredbymach1"]');
    cy.get('a[href="https://join.slack.com/t/spatialaudio/shared_invite/enQtNjk0ODE4NjQ4NjExLWQ5YWUyNWQ4NWEwMDEwZmJiNmI5MzBhYjM3OTE3NTYxYzdjZDE2YTlhZDI4OGY0ZjdkNmM1NzgxNjI5OGU4ZWE"]');
    cy.get('a[href="https://www.youtube.com/channel/UCqoFv8OnTYjkwjHeo6JDUFg"]');
  });
});
