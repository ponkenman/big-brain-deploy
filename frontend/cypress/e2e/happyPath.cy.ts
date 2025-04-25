import { BACKEND_URL, mockFetchData, register, URL } from "./helpers";

/** NOTE: JSON files assumes strict mode enabled (ie sometimes requests done twice) */

const loginData = {
  name: "Bob",
  email: "bob@email.com",
  password: "password",
  confirmPassword: "password"
}

describe("Happy path of user", () => {
  beforeEach(() => {
    // Mock POST /admin/auth/register
    mockFetchData("register", "../fixtures/register.json", ["POST", "/admin/auth/register"]);
  });

  it("Root URL redirects to login page", () => {
    cy.visit(URL);
    cy.get("h1").contains("Login");
  });

  it("Can register successfully", () => {
    mockFetchData("gamesEmpty", "../fixtures/emptyGames.json", ["GET", "/admin/games"]);
    cy.visit(URL);

    // Click Register button
    cy.contains("Register instead").click();
    // Fill in form details
    register(loginData);
  });

  it("Can create new empty game", () => {
    mockFetchData("getGames", ["../fixtures/emptyGames.json", "../fixtures/emptyGames.json", "../fixtures/newGame.json"], ["GET", "/admin/games"]);
    mockFetchData("putNewGame", "../fixtures/emptyResponse.json", ["PUT", "/admin/games"]);
    cy.visit(URL);
    cy.contains("Register instead").click();
    register(loginData);
    // Create new game
    cy.contains("Create Game").click();
    cy.get("#game-name").focus().type("My new game");
    // Click submit twice due to confirmation
    cy.contains("Submit").click();
    cy.contains("Submit").click();
    // Success alert appears
    cy.get("[role=alert]").should("have.class", "bg-green-200");

    // New games should appear
    cy.contains("My new game");
  });

  it("Can update name and thumbnail of game", () => {
    mockFetchData("getGames", ["../fixtures/newGame.json", "../fixtures/newGame.json", "../fixtures/newGame.json", "../fixtures/newGame.json", "../fixtures/updatedGame.json"], ["GET", "/admin/games"]);
    mockFetchData("putGames", "../fixtures/emptyResponse.json", ["PUT", "/admin/games"]);
    cy.visit(URL);
    cy.contains("Register instead").click();
    register(loginData);
    cy.get("#root > main > div > article > div.p-5 > div.mb-5 > div > div.flex.flex-col.gap-2 > button:nth-child(1)").click();

    cy.get("#root > main > div > section.rounded-md.bg-gray-300.mt-4.px-4.pb-2.relative > h2 > button").click();
    cy.get("#game-name").should("have.value", "My new game");
    cy.get("#game-name").focus().type(" 2");
    cy.get("#game-thumbnail").selectFile("cypress/assets/placeholder.png");
    cy.get("#game-thumbnail").should("have.value", "C:\\fakepath\\placeholder.png");
    cy.contains("Submit").click();
    cy.get("[role=alert]").should("have.class", "bg-green-200");
    cy.contains("My new game 2");
  });

  it("Can play game successfully and view results", () => {
    mockFetchData("getGames", ["../fixtures/updatedGame.json", "../fixtures/updatedGame.json", "../fixtures/updatedGameStarted.json", "../fixtures/updatedGameAfterEnded.json"], ["GET", "/admin/games"]);
    mockFetchData("putGames", "../fixtures/emptyResponse.json", ["PUT", "/admin/games"]);
    mockFetchData("mutateGame", ["../fixtures/mutateGameStart.json", "../fixtures/mutateGameEnd"], ["POST", "/admin/game/384405/mutate"]);
    mockFetchData("getResults", "../fixtures/gameResults.json", ["GET", "/admin/session/962832/results"]);
    mockFetchData("getResultsStatus", "../fixtures/gameResultsStatus.json", ["GET", "/admin/session/962832/status"]);

    cy.visit(URL);
    cy.contains("Register instead").click();
    register(loginData);
    cy.contains("Start game").click();
    cy.contains("Dismiss").click();
    cy.contains("Stop game").click();
    cy.contains("Yes").click();
    cy.contains("Results");
  });

  it.only("Can logout and login", () => {
    mockFetchData("getGames", "../fixtures/emptyGames.json", ["GET", "/admin/games"]);
    mockFetchData("logout", "../fixtures/emptyResponse.json", ["POST", "/admin/auth/logout"]);
    mockFetchData("login", "../fixtures/register.json", ["POST", "/admin/auth/login"]);

    cy.visit(URL);
    cy.contains("Register instead").click();
    register(loginData);
    cy.contains("Logout").click();
    cy.get("#login-name").focus().type("Bob");
    cy.get("#login-email").focus().type("bob@email.com");
    cy.get("#login-password").focus().type("password");
    cy.get("form button").contains("Login").click();
    cy.contains("Dashboard");
  });
});
