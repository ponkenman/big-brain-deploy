import { beforeEach, describe, it } from 'mocha'
import { initialiseMockFetch, register, URL } from './helpers'

/** NOTE: JSON file order in mock fetch data assumes strict mode enabled (ie sometimes requests done twice) */

const loginData = {
  name: 'Bob',
  email: 'bob@email.com',
  password: 'password',
  confirmPassword: 'password',
}

const mockFetchData = initialiseMockFetch(name => `../fixtures/happyPath/${name}.json`)

describe('Happy path of user', () => {
  beforeEach(() => {
    // Mock common HTTP requests
    mockFetchData('register', 'register', ['POST', '/admin/auth/register'])
    mockFetchData('putGames', 'emptyResponse', ['PUT', '/admin/games'])
    mockFetchData('logout', 'emptyResponse', ['POST', '/admin/auth/logout'])
    mockFetchData('login', 'register', ['POST', '/admin/auth/login'])
  })

  it('Root URL redirects to login page', () => {
    cy.visit(URL)
    cy.get('h1').contains('Login')
  })

  it('Can register successfully', () => {
    mockFetchData('gamesEmpty', 'emptyGames', ['GET', '/admin/games'])
    cy.visit(URL)

    // Click Register button
    cy.contains('Register instead').click()
    // Fill in form details
    register(loginData)
  })

  it('Can create new empty game', () => {
    mockFetchData('getGames', [
      // Four initial calls when page loaded
      'emptyGames', 'emptyGames', 'emptyGames', 'emptyGames',
      // Two calls when new game uploaded
      'newGame', 'newGame',
    ], ['GET', '/admin/games'])
    mockFetchData('putNewGame', 'emptyResponse', ['PUT', '/admin/games'])
    cy.visit(URL)
    cy.contains('Register instead').click()
    register(loginData)
    // Create new game
    cy.contains('Create Game').click()
    cy.get('#game-name')
    cy.focus()
    cy.type('My new game')
    // Click submit twice due to confirmation
    cy.contains('Submit').click()
    cy.contains('Submit').click()
    // Success alert appears
    cy.get('[role=alert]').should('have.class', 'bg-green-200')

    // New games should appear
    cy.contains('My new game')
  })

  it('Can update name and thumbnail of game', () => {
    // Register and click edit button
    mockFetchData('getGames', ['newGame', 'newGame', 'newGame', 'newGame', 'updatedGame'], ['GET', '/admin/games'])
    cy.visit(URL)
    cy.contains('Register instead').click()
    register(loginData)
    cy.get('#root > main > div > article > div.p-5 > div.mb-5 > div > div.flex.flex-col.gap-2 > button:nth-child(1)').click()

    // Now on edit game page, click edit button near title
    cy.get('#root > main > div > section.rounded-md.bg-gray-300.mt-4.px-4.pb-2.relative > h2 > button').click()
    // Uplaod new name and thumbnail
    cy.get('#game-name').should('have.value', 'My new game')
    cy.get('#game-name')
    cy.focus()
    cy.type(' 2')
    cy.get('#game-thumbnail').selectFile('cypress/assets/placeholder.png')
    cy.get('#game-thumbnail').should('have.value', 'C:\\fakepath\\placeholder.png')
    cy.contains('Submit').click()
    // New title should be present
    cy.get('[role=alert]').should('have.class', 'bg-green-200')
    cy.contains('My new game 2')
  })

  it('Can play game successfully and view results', () => {
    mockFetchData('getGames', [
      // Initial load of page
      'updatedGame', 'updatedGame',
      // After pressing start
      'updatedGameStarted', 'updatedGameStarted',
      // Pressing end
      'updatedGameAfterEnded', 'updatedGameAfterEnded', 'updatedGameAfterEnded',
    ], ['GET', '/admin/games'])
    mockFetchData('putGames', 'emptyResponse', ['PUT', '/admin/games'])
    mockFetchData('mutateGame', ['mutateGameStart', 'mutateGameEnd'], ['POST', '/admin/game/384405/mutate'])
    mockFetchData('getResults', 'gameResults', ['GET', '/admin/session/962832/results'])
    mockFetchData('getResultsStatus', 'gameResultsStatus', ['GET', '/admin/session/962832/status'])

    cy.visit(URL)
    cy.contains('Register instead').click()
    register(loginData)
    // Game started, then results viewed
    cy.contains('Start game').click()
    cy.contains('Dismiss').click()
    cy.contains('Active')
    cy.contains('Stop game').click()
    cy.contains('Yes').click()
    cy.contains('Results')
  })

  it('Can logout and login', () => {
    mockFetchData('getGames', 'emptyGames', ['GET', '/admin/games'])

    cy.visit(URL)
    cy.contains('Register instead').click()
    register(loginData)
    cy.contains('Logout').click()
    // Fill in login form
    cy.get('#login-name').focus().type('Bob')
    cy.get('#login-email').focus().type('bob@email.com')
    cy.get('#login-password').focus().type('password')
    cy.get('form button').contains('Login').click()
    // Login
    cy.contains('Dashboard')
  })
})
