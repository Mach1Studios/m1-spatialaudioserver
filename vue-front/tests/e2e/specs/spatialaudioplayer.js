describe('Spatial Audio Player', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the spatial audio player root url', () => {
    cy.login(username, password);
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config().baseUrl}`);
  });
  it('Spatial audio player playlists', () => {
    cy.login(username, password);
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config().baseUrl}`);

    cy.get('#Playlists-list').should('be.exist');

    cy.get('button')
      .should('be.exist')
      .contains('play')
      .click({ force: true });

    cy.get('.modal')
      .should('be.visible')
      .contains('Playlists');
    cy.get('#Playlist').should('be.exist');
    cy.get('.playlist-header').first().click();

    cy.get('table.table-list.flex-item').should('be.exist').first().children('tbody');
    cy.get('tbody').should('be.exist').children('tr');
    cy.get('td').eq(1).contains('ACNSN3D.wav');
    cy.get('td').eq(2).children('nav');
    cy.get('nav').children('button', 'cached');
    cy.get('nav').children('button', 'keyboard_return');
    cy.get('nav').children('button', 'info').first().click({ force: true });
  });
});
