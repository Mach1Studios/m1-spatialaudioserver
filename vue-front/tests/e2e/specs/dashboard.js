import 'cypress-file-upload';

describe('Dashboard', () => {
  const username = 'm1';
  const password = 'goodpassbro';

  it('Visits the dashboard root url', () => {
    cy.login(username, password);
    cy.visit('/dashboard');
    cy.url().should('eq', `${Cypress.config().baseUrl}dashboard`);
    cy.server({ method: 'GET' });

    cy.route({
      method: 'GET',
      url: 'fixtures:04_DailyLife_M1.wav',
    }).as('upload');
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
  //         url: 'fixtures:04_DailyLife_M1.wav',
  //       });
  //     });
  //   cy.wait('@upload', { requestTimeout: 120000 });
  //
  //   cy.server({ enable: true });
  // });
  it('Playlists', () => {
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

    cy.get('button').contains('Add track(s) in playlist').click();
    cy.get('table.table-list.flex-item').should('be.exist').first().children('tbody');
    cy.get('tbody').should('be.exist').children('tr');
    cy.get('td').eq(1).contains('ACNSN3D.wav');
    cy.get('td').eq(2).children('nav');
    cy.get('nav').children('button', 'cached');
    cy.get('nav').children('button', 'keyboard_return');
    cy.get('nav').children('button', 'info').first().click({ force: true });
  });
});
