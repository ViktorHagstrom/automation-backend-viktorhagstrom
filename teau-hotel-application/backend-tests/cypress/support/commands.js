// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const LOGIN_URL = 'http://localhost:3000/api/login'
const LOG_OUT_ENDPOINT = 'http://localhost:3000/api/logout'
const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'


//Log in
Cypress.Commands.add('authenticateSession', () => {

    const userCredentials = {
        "username": "tester01",
        "password": "GteteqbQQgSr88SwNExUQv2ydb7xuf8c"
    }
    cy.request({
        method: 'POST',
        url: LOGIN_URL,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCredentials)
    }).then((response => {
        expect(response.status).to.eq(200) // assert status code
        Cypress.env({ loginToken: response.body }) // create global variabel for token
    }))
})
// Log out
Cypress.Commands.add('endSession', () => {

    const logoutPayload = {
        "username": "tester01",
        "token": JSON.stringify(Cypress.env().loginToken)
    }
    cy.request({
        method: 'POST',
        url: LOG_OUT_ENDPOINT,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logoutPayload)
    }).then((response => {
        // Assert logged out
        expect(response.status).to.eq(200) // assert status code
    }))
})
Cypress.Commands.add('setLatestRoomId', () => {
    cy.request({
        method: "GET",
        url: ENDPOINT_GET_ROOMS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        Cypress.env({ lastId: response.body[response.body.length - 1].id })
        Cypress.env({ lastRoomDate: response.body[response.body.length - 1].created })
    }))
})