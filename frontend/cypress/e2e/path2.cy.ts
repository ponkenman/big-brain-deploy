import { BACKEND_URL, register, URL } from "./helpers";

const loginData = {
  name: "Bob",
  email: "bob@email.com",
  password: "password",
  confirmPassword: "password"
}

describe("template spec", () => {
  beforeEach(() => {
    // Mock POST /admin/auth/register
    cy.intercept({
      method: "POST",
      url: `${BACKEND_URL}/admin/auth/register`,
    }, {
      statusCode: 200,
      body: {
        "token": "token"
      }
    }).as('registerApi');

    cy.visit(URL);
  });

  it("Root URL redirects to login page", () => {
    cy.get("h1").contains("Login");
  });

  describe("Registering", () => {
    beforeEach(() => {
      // Mock get games to be empty
      cy.intercept({
        method: "GET",
        url: `${BACKEND_URL}/admin/games`,
      }, {
        statusCode: 200,
        body: {
          "games": []
        }
      }).as('getGamesApi');
    });

    it('Can register successfully', () => {
      // Mock GET /admin/games where no games
      cy.intercept({
        method: "GET",
        url: `${BACKEND_URL}/admin/games`,
      }, {
        statusCode: 200,
        body: {
          "games": []
        }
      }).as('getGamesApi');
  
  
      // Click Register button
      cy.contains("Register instead").click();
      // Fill in form details
      register(loginData);
    });

    const invalidInputs = [
      { name: "name empty", input: {...loginData, name: ""}},
      { name: "email empty", input: {...loginData, email: ""}},
      { name: "password empty", input: {...loginData, password: ""}},
      { name: "password and confirm pssword different", input: {...loginData, password: "password2"}},
    ]
    invalidInputs.forEach(({name, input}) => {
      it(`Error when ${name}`, () => {
        cy.contains("Register instead").click();
        register(input);
        // Check that error appears
        cy.get("[role=alert]").should("have.class", "bg-red-200");
      });
    });

  });

})