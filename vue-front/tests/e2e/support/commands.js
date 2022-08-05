// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
//
Cypress.Commands.add('login', (login, password) => {
  cy.visit('/');
  cy.get('.modal').should('not.be.visible');

  cy.get('button.login')
    .should('be.exist')
    .click();

  cy.get('input[name=login]').type(login);
  cy.get('input[name=password]').type(password);
  cy.get('form').submit();
});

Cypress.Commands.add('expectPlayingAudio', () => {
  cy.get('audio').should((els) => {
    let audible = false;
    els.each((i, el) => {
      if (el.duration > 0 && !el.paused && !el.muted) {
        audible = true;
      }
    });
    expect(audible).to.eq(true);
  });
});
