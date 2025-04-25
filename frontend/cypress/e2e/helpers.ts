// Helper functions for tests

import { fetchBackend } from '../../src/helpers'

export const URL = 'http://localhost:3000'
export const BACKEND_URL = 'http://localhost:5005'

/** Automates user login */
export const register = ({ name, email, password, confirmPassword }: { name: string, email: string, password: string, confirmPassword: string }) => {
  if (name !== '') {
    cy.get('#register-name')
      .focus()
      .type(name)
  }
  if (email !== '') {
    cy.get('#register-email')
      .focus()
      .type(email)
  }
  if (password !== '') {
    cy.get('#register-password')
      .focus()
      .type(password)
  }
  if (confirmPassword !== '') {
    cy.get('#register-password-confirm')
      .focus()
      .type(confirmPassword)
  }
  cy.get('form button').contains('Register').click()
}

export function initialiseMockFetch(pathFilter: (name: string) => string) {
  return function mockFetchData(alias: string, jsonFilePath: string | string[], [httpMethod, urlFragment, options, token]: Parameters<typeof fetchBackend>) {
    let index = 0
    function getFixture() {
      return Array.isArray(jsonFilePath) ? jsonFilePath.map(pathFilter)[index++] : pathFilter(jsonFilePath)
    }

    console.log(jsonFilePath[index])
    cy.intercept(
      httpMethod,
      `${BACKEND_URL}${urlFragment}`,
      (req) => {
        req.reply({
          statusCode: 200,
          fixture: getFixture(),
        })
      }).as(alias)
  }
}
