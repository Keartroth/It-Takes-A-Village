import React, { useContext, useState } from "react"
import emailjs from 'emailjs-com'
import Button from "react-bootstrap/Button"
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import format from 'date-fns/format'
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
    const villageProtege = props.villageProtege
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const rsvpModal = props.rsvpModal
    const rsvpState = props.rsvpState || { startDate: " ", endDate: " " }
    const { deleteVillageEvent, updateVillageEvent } = useContext(VillageEventsContext)
    const { userVillageEvents, addUserVillageEvent, deleteUserVillageEvent } = useContext(UserVillageEventsContext)

    const currentEventUsers = userVillageEvents.filter(uve => uve.villageEventsId === rsvpState.id) || []
    const rsvpCheck = currentEventUsers.find(ceu => ceu.userId === currentUserId)

    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')

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

    const [editState, setEditState] = useState({})
    const [editEvent, setEditEvent] = useState(false)

    const handleEditChange = (e) => {
        const updatedState = { ...editState }
        updatedState[e.target.id] = e.target.value
        setEditState(updatedState)
    }

    const toggleEditEvent = () => {

        if (Object.keys(editState).length === 0) {
            const formatObject = { ...rsvpState }
            formatObject.endDate = format(rsvpState.endDate, 'yyyy-MM-dd')
            formatObject.endTime = format(rsvpState.endDate, 'HH:mm')
            formatObject.startDate = format(rsvpState.startDate, 'yyyy-MM-dd')
            formatObject.startTime = format(rsvpState.startDate, 'HH:mm')

            setEditState(formatObject)
            setEditEvent(!editEvent)
        } else {
            setEditState({})
            setEditEvent(!editEvent)
        }
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
        const messageParams = {
            event_change_message: `The following event you have RSVP'd has been canceled, \n Title: ${rsvpState.title} \n Location: ${rsvpState.location} \n Expected Cost: $${rsvpState.cost} \n Description:  ${rsvpState.description},\n Start Time: ${rsvpState.startDate} \n End Time: ${rsvpState.endDate}`,
            patron_email: "",
            protege_email: `${villageProtege.email}`,
            protege_name: `${villageProtege.firstName} ${villageProtege.lastName}`,
            contact_number: Math.random() * 100000 | 0
        }

        const currentEventUsersMinusProtege = currentEventUsers.filter(ceu => ceu.userId !== villageProtege.id)

        for (const eventUser of currentEventUsersMinusProtege) {
            const userEmail = users.find(u => u.id === eventUser.userId).email
            messageParams.patron_email = userEmail
            emailjs.send('contact_service', 'event_change_contact_form', messageParams, 'user_1lhMcPcYLXSYYIlvQBGcC')
                .then((response) => {
                    console.log('SUCCESS!', response.status, response.text)
                }, (error) => {
                    console.log('FAILED...', error)
                })
        }

        deleteVillageEvent(eventId).then(() => { toggleRSVPEvent({}) })
    }

    const updateEvent = () => {
        const startFormat = editState.startDate + " " + editState.startTime + ":00"
        const endFormat = editState.endDate + " " + editState.endTime + ":00"

        if (startFormat <= endFormat) {
            editState.startDate = new Date(startFormat).toString()
            editState.endDate = new Date(endFormat).toString()
            editState.cost = parseInt(editState.cost)

            delete editState.startTime
            delete editState.endTime

            const messageParams = {
                event_change_message: `The following event you have RSVP'd has been changed, \n Title: ${rsvpState.title} \n Location: ${rsvpState.location} \n Expected Cost: $${rsvpState.cost} \n Description:  ${rsvpState.description},\n Start Time: ${rsvpState.startDate} \n End Time: ${rsvpState.endDate} \n \n ${rsvpState.title} was been changed by, ${villageProtege.firstName} ${villageProtege.lastName} to the following, \n \n Title: ${editState.title} \n Location: ${editState.location} \n Expected Cost: $${editState.cost} \n Description:  ${editState.description},\n Start Time: ${editState.startDate} \n End Time: ${editState.endDate}`,
                patron_email: "",
                protege_email: `${villageProtege.email}`,
                protege_name: `${villageProtege.firstName} ${villageProtege.lastName}`,
                contact_number: Math.random() * 100000 | 0
            }

            const currentEventUsersMinusProtege = currentEventUsers.filter(ceu => ceu.userId !== villageProtege.id)

            for (const eventUser of currentEventUsersMinusProtege) {
                const userEmail = users.find(u => u.id === eventUser.userId).email
                messageParams.patron_email = userEmail
                emailjs.send('contact_service', 'event_change_contact_form', messageParams, 'user_1lhMcPcYLXSYYIlvQBGcC')
                    .then((response) => {
                        console.log('SUCCESS!', response.status, response.text)
                    }, (error) => {
                        console.log('FAILED...', error)
                    })
            }

            updateVillageEvent(editState).then(() => {
                toggleEditEvent()
                toggleRSVPEvent({})
            })
        } else {
            window.alert("Event start date must be before event end date.")
        }
    }

    return (
        <Modal id="rsvpEventForm" show={rsvpModal}>
            <ModalHeader id="modal-header">
                {rsvpCheck ? <h5>You are currently RSVP'd for this event.</h5> : <h5>You are not currently attending this event.</h5>}
                {!editEvent ?
                    <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleRSVPEvent}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    : ""}
            </ModalHeader>
            <ModalBody>
                {!editEvent ?
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
                        <div className="buttonContainer">
                            {rsvpCheck ? <Button onClick={() => { leaveEvent(currentEventUsers) }}>Leave event</Button> : <Button onClick={() => { joinEvent(rsvpState.id) }}>Join event</Button>}
                            {currentUserIsProtegeCheck ? <Button onClick={() => { cancelEvent(rsvpState.id) }}>Cancel event</Button> : ""}
                            {currentUserIsProtegeCheck && !editEvent ? <Button onClick={toggleEditEvent}>Edit event</Button> : ""}
                        </div>
                    </Container> :
                    <Form id="editEventForm" onSubmit={(e) => {
                        e.preventDefault()
                        updateEvent()
                    }}>
                        <Form.Row>
                            <Col>
                                <Form.Label>Start Date:</Form.Label>
                                <Form.Control id="startDate" type="date" min={today} defaultValue={editState.startDate} onChange={handleEditChange} required />
                            </Col>
                            <Col>
                                <Form.Label>Start Time:</Form.Label>
                                <Form.Control id="startTime" step="300" type="time" defaultValue={editState.startTime} onChange={handleEditChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>End Date:</Form.Label>
                                <Form.Control id="endDate" type="date" min={today} defaultValue={editState.endDate} onChange={handleEditChange} required />
                            </Col>
                            <Col>
                                <Form.Label>End Time:</Form.Label>
                                <Form.Control id="endTime" step="300" type="time" defaultValue={editState.endTime} onChange={handleEditChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Event Name:</Form.Label>
                                <Form.Control id="title" defaultValue={editState.title} onChange={handleEditChange} required />
                            </Col>
                            <Col>
                                <Form.Label>Estimated Cost:</Form.Label>
                                <Form.Control id="cost" type="number" min="0" step="1" defaultValue={editState.cost} onChange={handleEditChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Location:</Form.Label>
                            <Form.Control id="location" defaultValue={editState.location} onChange={handleEditChange} required />
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Description:</Form.Label>
                            <Form.Control id="description" as="textarea" defaultValue={editState.description} onChange={handleEditChange} required />
                        </Form.Row>
                        <Form.Group className="buttonContainer">
                            <Button type="submit">Update event</Button>
                        </Form.Group>
                    </Form>}

            </ModalBody>
        </Modal>
    )
}