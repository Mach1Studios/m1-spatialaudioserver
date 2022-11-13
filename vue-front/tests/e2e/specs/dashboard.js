describe('Dashboard', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the dashboard root url', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);
  });

  it('Play track in playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');
    cy.get('.playlist-header').first().click();

    cy.get('table.table-list.flex-item').should('be.exist').first().children('tbody');
    cy.get('table.table-list.flex-item > tbody > tr > td.audio-name').first()
      .click({ force: true });

    cy.get('#app-body-second').should('be.exist').and('be.visible');
    cy.get('#Controls').should('be.exist').and('be.visible');
    cy.get('.channel-name').should('be.exist').and('be.visible');
    cy.get('.channel-controls').should('be.exist').and('be.visible');
    cy.get('.channel-wave').should('be.exist').and('be.visible');
    cy.get('.controls').should('be.exist').and('be.visible');

    cy.get('canvas').should('be.exist').and('be.visible').and('have.class', 'visualizer')
      .and('have.css', 'height', '50px');

    cy.get('input[type=range]').first().should('have.value', '0.5')
      .invoke('val', 0.87)
      .get('input[type=range]')
      .first()
      .should('have.value', '0.87');

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

  it('Add track in playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');
    cy.get('.playlist-header').first().click();
    cy.get('button').contains('Add track(s) in playlist').click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/upload',
      method: 'POST',
      response: { status: 'Created', code: 201 },
    });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/tracks',
      method: 'GET',
      response: { status: 'OK', code: 200 },
    });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists/7441472e-4465-4556-8686-24e55a8814f7',
      method: 'PUT',
      response: { status: 'No Content', code: 204 },
    });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists/7441472e-4465-4556-8686-24e55a8814f7',
      method: 'OPTIONS',
      response: { status: 'No Content', code: 204 },
    });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api',
      method: 'GET',
      response: { status: '', code: 301 },
    });

    cy.get('.modal')
      .should('be.visible')
      .contains('Add track(s) in playlist');

    cy.get('.playlist-select > select > option').find('label')
      .first()
      .wait(1000)
      .parent()
      .trigger('change', { force: true })
      .click({ force: true });

    cy.get('button').contains('highlight_off').click({ force: true });
  });

  it('Delete track in playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');
    cy.get('.playlist-header').first().click();

    cy.get('button').contains('Add track(s) in playlist').click({ force: true });

    cy.get('.modal')
      .should('be.visible')
      .contains('Add track(s) in playlist');

    cy.get('table.table-invite.flex-item')
      .find('tr:nth-child(1)')
      .find('nav')
      .children('button')
      .contains('delete')
      .click({ force: true });

    cy.get('button').contains('highlight_off').click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/tracks/97e482c4-cc90-4ce3-b595-fc95a50a0e9c',
      method: 'DELETE',
      response: { status: 'No Content', code: 204 },
    });
  });

  it('Add new playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');

    cy.get('button').contains('Add new playlist').click({ force: true });

    cy.get('.modal')
      .should('be.visible')
      .contains('Add new playlist');

    cy.get('input[name=name]').last().focus().type('NEW PLAYLIST');

    cy.get('button').find('span').contains('Create new playlist')
      .click({ force: true });

    cy.get('button').contains('highlight_off').click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists',
      method: 'POST',
      response: { status: 'Created', code: 201 },
    });
  });

  it('Delete playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');

    cy.get('.playlist-header')
      .last()
      .find('button')
      .contains('delete')
      .click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists/7441472e-4465-4556-8686-24e55a8814f7',
      method: 'DELETE',
      response: { status: 'No Content', code: 204 },
    });
  });

  it('Visibility of playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');

    cy.get('.playlist-header')
      .first()
      .find('button')
      .contains('visibility')
      .click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists/aee601ef-4fd7-440e-954f-9f91509a2151',
      method: 'PUT',
      response: { status: 'No Content', code: 204 },
    });
  });

  it('Rename playlist', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('Playlists').last()
      .click({ force: true });

    cy.get('#Playlists')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#Playlist').should('be.exist');

    cy.get('.playlist-header')
      .find('button')
      .contains('edit')
      .click({ force: true });

    cy.get('.modal')
      .should('be.visible')
      .contains('Rename playlist');

    cy.get('input[name=name]')
      .last()
      .focus()
      .clear({ force: true })
      .type('old', { force: true })
      .trigger('keyup', {
        key: 'Enter',
        force: true,
      });

    cy.get('button[type=button]')
      .find('span')
      .contains('Save')
      .trigger('click', { force: true })
      .click({ force: true });

    cy.get('button').contains('highlight_off').click({ force: true });

    cy.server();
    cy.route({
      url: 'http://localhost:8080/api/playlists/f00aefc0-c5a8-4977-aa6a-8c632efff1bf',
      method: 'PUT',
      response: { status: 'No Content', code: 204 },
    });
  });

  it('Audio Player', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);

    cy.get('#app-body-first')
      .should('be.exist')
      .and('have.class', 'card')
      .children('.tabs');

    cy.get('.tabs')
      .should('be.exist')
      .contains('File List').first()
      .click({ force: true });

    cy.get('#FileList')
      .should('be.exist')
      .and('have.class', 'page active');

    cy.get('#FileList').should('be.exist');

    cy.get('table.table-list.flex-item').should('be.exist').first().children('tbody');

    cy.get('table.table-list.flex-item > tbody > tr > td.audio-name').first()
      .click({ force: true });

    cy.expectPlayingAudio();
  });
  // it('Choose a file', () => {
  //   cy.login(username, password);
  //   cy.visit('/dashboard');
  //   cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);
  //
  //   cy.get('#app-body-first')
  //     .should('be.exist')
  //     .and('have.class', 'card')
  //     .children('.tabs');
  //
  //   cy.get('.tabs')
  //     .should('be.exist')
  //     .contains('File List');
  //
  //   cy.get('#FileList')
  //     .should('be.exist')
  //     .and('have.class', 'page active');
  //
  //   cy.get('table')
  //     .should('be.exist')
  //     .and('have.class', 'table-list');
  //
  //   cy.get('button')
  //     .should('be.exist')
  //     .contains('CHOOSE A FILE...')
  //     .click({ force: true });
  //
  //   cy.get('.modal')
  //     .should('be.visible')
  //     .contains('CHOOSE A FILE...');
  //
  //   cy.get('button.btn-uploader')
  //     .should('be.visible')
  //     .click();
  //
  //   const fileName = '04_DailyLife_M1.wav';
  //
  //   cy.server({ method: 'GET' });
  //   cy.route({
  //     method: 'GET',
  //     url: 'fixtures:04_DailyLife_M1.wav',
  //   }).as('upload');
  //   cy.fixture(fileName, 'base64')
  //     .then((fileContent) => {
  //       cy.get('input[type=file]').attachFile({
  //         fileContent,
  //         fileName,
  //         mimeType: 'audio/04_DailyLife_M1.wav',
  //         encoding: 'utf8',
  //         lastModified: new Date().getTime(),
  //         url: 'fixtures/04_DailyLife_M1.wav',
  //       });
  //     });
  //   cy.wait('@upload', { requestTimeout: 120000 });
  //
  //   cy.server({ enable: true });
  // });
});
