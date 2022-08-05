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
    cy.get('td').eq(1);
    cy.get('td').eq(2).children('nav');
    cy.get('nav').children('button', 'cached');
    cy.get('nav').children('button', 'keyboard_return');
    cy.get('nav').children('button', 'info').first().click({ force: true });
  });

  it('Play track in playlist', () => {
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
    cy.get('table.table-list.flex-item > tbody > tr > td.audio-name').first()
      .click({ force: true });
    cy.expectPlayingAudio();

    cy.get('details').should('be.exist').and('be.visible').and('have.class', 'audio-player-debug')
      .children('summary')
      .last()
      .trigger('toogle', { force: true })
      .click({ force: true });
    cy.get('table.table-dash').should('be.exist').and('be.visible');
    cy.get('tr').contains('Stream:');
    cy.get('tr').contains('Number of audio channels:');
    cy.get('tr').contains('Audio Bitrate:');
    cy.get('tr').contains('Buffer Level:');
    cy.get('tr').contains('Update Period:');
    cy.get('tr').contains('Suggestion Delay:');
    cy.get('tr').contains('Profiles:');
    cy.get('details').should('be.exist').and('be.visible').and('have.class', 'audio-player-debug')
      .children('summary')
      .last()
      .trigger('toogle', { force: true })
      .click({ force: true });
  });
  it('Canvas', () => {
    cy.login(username, password);
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config().baseUrl}`);

    cy.get('#touchstats');
  });
});
