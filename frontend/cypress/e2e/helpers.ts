// Helper functions for tests

export const URL = "http://localhost:3000";
export const BACKEND_URL = "http://localhost:5005";

/** Automates user login */
export const register = ({name, email, password, confirmPassword}: {name: string, email: string, password: string, confirmPassword: string}) => {
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