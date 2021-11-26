const faker = require('faker')

const ENDPOINT_GET_CLIENTS = 'http://localhost:3000/api/clients'
const ENDPOINT_NEW_CLIENT = 'http://localhost:3000/api/client/new'
const ENDPOINT_GET_CLIENT = 'http://localhost:3000/api/client/'

// Create client data
function createClientPayload() {
    const payload = {
        'name': faker.name.firstName(),
        'email': faker.internet.email(),
        'telephone': faker.phone.phoneNumber()
    }
    return payload
}
function createNewClientPayload(id) {
    const payload = {
        "name": faker.name.firstName(),
        "email": faker.internet.email(),
        "telephone": faker.phone.phoneNumber(),
        "id": id,
        "created": faker.date.recent()
    }
    return payload
}
// Create client
function createClient(cy) {
    let clientPayload = createClientPayload()
    //Post request to create client
    cy.request({
        method: 'POST',
        url: ENDPOINT_NEW_CLIENT,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body: clientPayload
    }).then((response => {
        const responseString = JSON.stringify(response.body)
        expect(responseString).to.have.string(clientPayload.name)
    }))
}
// Delete Client
function deleteLatestClient(cy) {
    // Get all clients
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        let lastId = response.body[response.body.length - 1].id
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            cy.request({
                method: 'GET',
                url: ENDPOINT_GET_CLIENTS,
                headers: {
                    'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                    'Content-Type': 'application/json'
                },
            }).then((response => {
                var responseString = JSON.stringify(response.body)
                expect(responseString).to.not.have.string('id\: ' + lastId)
                //cy.log(responseString)
            }))
        }))
    }))
}
// Edit client
function editLatestClient(cy) {
    cy.request({
        method: 'GET',
        url: ENDPOINT_GET_CLIENTS,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
    }).then((response => {
        let lastId = response.body[response.body.length - 1].id
        let newClientData = createNewClientPayload(lastId)
        //cy.log(lastId)
        cy.request({
            method: 'PUT',
            url: ENDPOINT_GET_CLIENT + lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: newClientData
        }).then((response => {
            expect(JSON.stringify(response.body)).to.have.string(JSON.stringify(newClientData))
        }))
    }))
}
function createAndDeleteClient(cy) {
    cy.authenticateSession().then(() => {
        createClient(cy)
        deleteLatestClient(cy)
    })
    cy.endSession()
}
function createEditDeleteClient(cy) {
    cy.authenticateSession().then(() => {
        createClient(cy)
        editLatestClient(cy)
        deleteLatestClient(cy)
    })
    cy.endSession()
}
module.exports = {
    createAndDeleteClient,
    createEditDeleteClient
}


