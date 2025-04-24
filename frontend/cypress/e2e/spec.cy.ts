const URL = "http://localhost:3000"
const BACKEND_URL = "http://localhost:5005"

const loginData = {
  name: "Bob",
  email: "bob@email.com",
  password: "password",
  confirmPassword: "password"
}

const register = ({name, email, password, confirmPassword}: {name: string, email: string, password: string, confirmPassword: string}) => {
  if (name !== "") {
    cy.get("#register-name")
    .focus()
    .type(name);
  }
  if (email !== "") {
    cy.get("#register-email")
    .focus()
    .type(email);
  }
  if (password !== "") {
    cy.get("#register-password")
    .focus()
    .type(password);
  }
  if (confirmPassword !== "") {
    cy.get("#register-password-confirm")
    .focus()
    .type(confirmPassword);
  }
  cy.get("form button").contains("Register").click();
  
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
        // TODO: check error message appears
      });
    });

  });

})