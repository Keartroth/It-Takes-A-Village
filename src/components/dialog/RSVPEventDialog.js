import React, { useContext } from "react"
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { VillageEventsContext } from "../providers/VillageEventsProvider"
import { UserVillageEventsContext } from "../providers/UserVillageEventsProvider"
import "./Dialog.css"

export const RSVPEventForm = props => {
    const toggleRSVPEvent = props.toggleRSVPEvent
    const users = props.users
    const currentUserId = props.userId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const rsvpModal = props.rsvpModal
    const rsvpState = props.rsvpState || { startDate: " ", endDate: " " }
    const { deleteVillageEvent } = useContext(VillageEventsContext)
    const { userVillageEvents, addUserVillageEvent, deleteUserVillageEvent } = useContext(UserVillageEventsContext)

    const currentEventUsers = userVillageEvents.filter(uve => uve.villageEventsId === rsvpState.id) || []
    const rsvpCheck = currentEventUsers.find(ceu => ceu.userId === currentUserId)

    let startDate = ""
    let startTime = ""
    let endDate = ""
    let endTime = ""

    if (rsvpState.startDate) {
        startDate = rsvpState.startDate.toLocaleDateString()
        startTime = rsvpState.startDate.toLocaleTimeString()

        endDate = rsvpState.endDate.toLocaleDateString()
        endTime = rsvpState.endDate.toLocaleTimeString()
    }

    const joinEvent = (eventId) => {
        let userVillageEvent = {
            villageEventsId: eventId,
            userId: currentUserId
        }
        addUserVillageEvent(userVillageEvent).then(() => { toggleRSVPEvent({}) })
    }

    const leaveEvent = (currentEventUsers) => {

        const foundEventUser = currentEventUsers.find(ceu => ceu.userId === currentUserId)
        deleteUserVillageEvent(foundEventUser.id).then(() => { toggleRSVPEvent({}) })
    }

    const cancelEvent = (eventId) => {
        deleteVillageEvent(eventId).then(() => { toggleRSVPEvent({}) })
    }

    return (
        <Modal id="rsvpEventForm" show={rsvpModal}>
            <ModalHeader id="modal-header">
                {rsvpCheck ? <h5>You are currently RSVP'd for this event.</h5> : <h5>You are not currently attending this event.</h5>}
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleRSVPEvent}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <Container>
                    <div>
                        <h5>{rsvpState.name}</h5>
                        <p>Start: {startDate} at {startTime}<br></br>End: {endDate} at {endTime}<br></br>Estimated Cost: ${rsvpState.cost}<br></br>Event description: {rsvpState.description}</p>
                        <h5>Attending Villagers</h5>
                        {currentEventUsers.length === 0
                            ? <h6>There are no villagers currently RSVP'd for this event.</h6>
                            : <ul>
                                {
                                    currentEventUsers.map(ceu => {
                                        const villager = users.find(u => u.id === ceu.userId)
                                        return <li key={villager.id}>{villager.firstName} {villager.lastName}</li>
                                    })
                                }
                            </ul>}
                    </div>
                    <div>
                        {rsvpCheck ? <Button onClick={() => { leaveEvent(currentEventUsers) }}>Leave this event</Button> : <Button onClick={() => { joinEvent(rsvpState.id) }}>Join this event</Button>}
                        {currentUserIsProtegeCheck ? <Button onClick={() => { cancelEvent(rsvpState.id) }}>Cancel this event</Button> : ""}
                    </div>
                </Container>
            </ModalBody>
        </Modal>
    )
}