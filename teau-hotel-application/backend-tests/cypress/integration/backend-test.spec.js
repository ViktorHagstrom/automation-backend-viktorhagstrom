import * as clientHelpers from '../helpers/clientHelpers'
import * as roomHelpers from '../helpers/roomHelpers'

describe('Backend test suite', function () {

    it('T1: Logs in and then out', function () {
        cy.authenticateSession()
        cy.endSession()
    })
    it('T2: Create and deletes a client', function () {
        clientHelpers.createAndDeleteClient(cy)
    })
    it('T3: Create,update and delete a client', function () {
        clientHelpers.createEditDeleteClient(cy)
    })
    it('T4: Create and delete room', function () {
        roomHelpers.createAndDeleteRoom(cy)
    })
    it('T5: Create, edit and delete room', function () {
        roomHelpers.createEditAndDeleteRoom(cy)
    })
})