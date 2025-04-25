import { initialiseMockFetch, register, URL } from './helpers'

const loginData = {
  name: 'Bob',
  email: 'bob@email.com',
  password: 'password',
  confirmPassword: 'password',
}

const mockFetchData = initialiseMockFetch(name => `../fixtures/path2/${name}.json`)

describe('Registering', () => {
  beforeEach(() => {
    // Mock POST /admin/auth/register
    mockFetchData('registerApi', 'register', ['POST', '/admin/auth/register'])
    mockFetchData('getGames', 'noGames', ['GET', '/admin/games'])
    cy.visit(URL)
  })

  it('Can register successfully', () => {
    // Click Register button
    cy.contains('Register instead').click()
    // Fill in form details
    register(loginData)
  })

  const invalidInputs = [
    { name: 'name empty', input: { ...loginData, name: '' } },
    { name: 'email empty', input: { ...loginData, email: '' } },
    { name: 'password empty', input: { ...loginData, password: '' } },
    { name: 'password and confirm pssword different', input: { ...loginData, password: 'password2' } },
  ]
  invalidInputs.forEach(({ name, input }) => {
    it(`Error when ${name}`, () => {
      cy.contains('Register instead').click()
      register(input)
      // Check that error appears
      cy.get('[role=alert]').should('have.class', 'bg-red-200')
    })
  })
})

describe('Creating games', () => {
  beforeEach(() => {
    mockFetchData('registerApi', 'register', ['POST', '/admin/auth/register'])
    mockFetchData('putGames', 'emptyResponse', ['PUT', '/admin/games'])
  })

  it('Can upload game from json file and view questions/modals', () => {
    mockFetchData('getGames', [
      // Double call on initial load
      'noGames', 'noGames', 'noGames', 'noGames',
      // When game first uploaded
      'newGameFromJson', 'newGameFromJson',
      // Double call when edit game page rendered
      'newGameFromJson', 'newGameFromJson',
      // Double call when edit question page rendered
      'newGameFromJson', 'newGameFromJson',
      // Double call when cancelling edit and returning to edit game page
      'newGameFromJson', 'newGameFromJson',
      // Double call when returning back to dashboard
      'newGameFromJson', 'newGameFromJson',
    ], ['GET', '/admin/games'])
    cy.visit(URL)
    cy.contains('Register instead').click()
    register(loginData)
    cy.contains('Create Game').click()
    cy.contains('Import from json file instead').click()
    cy.get('#game-upload').selectFile('../2.5.json')
    cy.contains('Submit').click()
    cy.contains('Quiz 1')
    // Click delete button but cancel deletion
    cy.get('#root > main > div > article > div.p-5 > div.mb-5 > div > div.flex.flex-col.gap-2 > button:nth-child(2)').click()
    cy.contains('Cancel').click()

    // Press edit button on new game questions
    cy.get('#root > main > div > article > div.p-5 > div.mb-5 > div > div.flex.flex-col.gap-2 > button:nth-child(1)').click()
    // Check whether questions in correct order
    cy.contains('1) Am I cooked?')
    cy.contains('2) Why do i suck at 6080?')

    // Go to edit screen for first question
    cy.get('#root > main > div > section:nth-child(5) > div > article:nth-child(1) > div.flex.flex-col.gap-2 > button:nth-child(1)').click()

    // Edit question
    cy.get('#question0-text').focus().clear().type('My new question 100')

    // Check question type and correctness
    cy.get('#question-type-select-823558').contains('Judgement')
    cy.get('#question0-answer-correct').should('be.checked')

    // Check if question type can be changed and answers added
    cy.get('#question-type-select-823558').select('Single Choice')
    // Check there are at least two answers
    cy.contains('#2')
    cy.contains('Add Answers').click()
    cy.contains('Add Answers').click()
    cy.contains('Add Answers').click()
    cy.contains('Add Answers').click()
    cy.contains('Add Answers').should('not.exist')

    // Ticking one checkbox unticks others
    cy.contains('#1').find('input[type=checkbox]').check()
    cy.contains('#2').find('input[type=checkbox]').check()
    cy.contains('#1').find('input[type=checkbox]').should('not.be.checked')

    // Can fill in different answers for each
    const answers = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
    answers.forEach((v, i) => {
      cy.contains(`#${i + 1}`).find('input[type=text]').focus().type(`My ${v} answer`)
    })

    // Can preserve other answers when some are deleted
    cy.contains('#3').find('button').click()
    cy.contains('#5').find('button').click()
    cy.contains('#2').find('button').click()
    cy.contains('#3').find('input[type=text').should('have.value', 'My fifth answer')
    cy.contains('My sixth answer').should('not.exist')

    // Upload new question media
    cy.get('#question0-media').contains('None')
    cy.get('#question0-media').select('Image')
    cy.get('#question0-media-file').selectFile('cypress/assets/placeholder.png')
    // Check if current image now displayed
    cy.contains('Current Image')

    // Check no changes were saved on return
    cy.contains('Cancel').click()
    cy.contains('1) Am I cooked?')

    // Open and close create question form
    cy.contains('Add Questions').click()

    cy.contains('Cancel').click()
    cy.contains('Back to dashboard').click()
  })
})
