const faker = require('faker')

const ENDPOINT_GET_ROOMS = 'http://localhost:3000/api/rooms'
const ENDPOINT_NEW_ROOM = 'http://localhost:3000/api/room/new'
const ENDPOINT_GET_ROOM = 'http://localhost:3000/api/room/'

// Create a payload for room creation
function createRoomPayload() {
    const roomPayload =
    {
        'features': ["balcony"], // dont want to hardcode these but cba to do anything about it atm
        'category': "single",
        'number': faker.datatype.number({
            'min': 1,
            'max': 10
        }),
        'floor': faker.datatype.number({
            'min': 1,
            'max': 6
        }),
        'available': true,
        'price': faker.datatype.number({
            'min': 999,
            'max': 6000
        })
    }
    return roomPayload
}
function updateRoomPayload(id, date) {
    const updateRoomPayload = {
        "id": id,
        "created": date,
        "category": "double",
        "floor": faker.datatype.number({
            'min': 1,
            'max': 6
        }),
        "number": faker.datatype.number({
            'min': 1,
            'max': 10
        }),
        "available": true,
        "price": faker.datatype.number({
            'min': 999,
            'max': 6000
        }),
        "features": ["balcony", "sea_view", "ensuite"]
    }
    return updateRoomPayload
}
// Set latest room id to global variable lastId
function createRoom(cy) {
    const roomPayLoad = createRoomPayload()
    cy.request({
        method: "POST",
        url: ENDPOINT_NEW_ROOM,
        headers: {
            'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
            'Content-Type': 'application/json'
        },
        body: roomPayLoad
    }).then((response => {
        expect(response.status).to.eq(200)
        cy.log('Room created with id:' + response.body.id)
    }))
}
function deleteLatestRoom(cy) {
    cy.setLatestRoomId().then(() => {
        cy.request({
            method: "DELETE",
            url: ENDPOINT_GET_ROOM + Cypress.env().lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
        }).then((response => {
            expect(response.status).to.eq(200)
            cy.log('Room deleted')
        }))
    })
}
function editLatestRoom(cy) {
    cy.setLatestRoomId().then(() => {
        const roomPayLoad = updateRoomPayload(Cypress.env().lastId, Cypress.env().lastRoomDate)
        cy.request({
            method: "PUT",
            url: ENDPOINT_GET_ROOM + Cypress.env().lastId,
            headers: {
                'X-User-Auth': JSON.stringify(Cypress.env().loginToken),
                'Content-Type': 'application/json'
            },
            body: roomPayLoad
        }).then((response => {
            expect(response.status).to.eq(200)
            expect(JSON.stringify(response.body)).to.eq(JSON.stringify(roomPayLoad))
        }))
    })
}
function createAndDeleteRoom(cy) {
    cy.authenticateSession().then(() => {
        createRoom(cy)
        deleteLatestRoom(cy)
    })
    cy.endSession()
}
function createEditAndDeleteRoom(cy) {
    cy.authenticateSession().then(() => {
        createRoom(cy)
        editLatestRoom(cy)
        deleteLatestRoom(cy)      
    })
    cy.endSession()
}
module.exports = {
    createAndDeleteRoom,
    createEditAndDeleteRoom
}