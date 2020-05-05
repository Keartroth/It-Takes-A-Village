import React from "react"
import Button from "react-bootstrap/Button"
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import "./Dialog.css"

export const AddEventForm = props => {
    const modal = props.modal
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const addVillageEvent = props.addVillageEvent
    const villageEvents = props.villageEvents
    const addUserVillageEvent = props.addUserVillageEvent
    const toggleCalendar = props.toggleCalendar
    const eventState = props.eventState
    const setEventState = props.setEventState
    const currentUserId = parseInt(localStorage.getItem("villager"))

    const handleEventChange = (e) => {
        const updatedEvent = { ...eventState }
        updatedEvent[e.target.id] = e.target.value
        setEventState(updatedEvent)
    }

    const addEvent = () => {
        const userEventId = villageEvents.length + 1
        
        let eventObject = {
            villageId: villageId,
            date: eventState.date,
            time: eventState.time,
            name: eventState.name,
            description: eventState.description,
            location: eventState.location,
            cost: parseInt(eventState.cost)
        }

        let userEventObject = {
            villageEventsId: userEventId,
            userId: currentUserId
        }

        const promise = Promise.all([
            addUserVillageEvent(userEventObject),
            addVillageEvent(eventObject)
        ])
        promise.then(toggleCalendar)
    }

    return (
        <Modal show={modal} onSubmit={addEvent}>
            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Add an event to {villageProtege.firstName}'s village!
                </Modal.Title>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleCalendar}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Form id="addEventForm">
                        <Form.Row>
                            <Col>
                                <Form.Label>Date:</Form.Label>
                                <Form.Control id="date" type="date" onChange={handleEventChange} required />
                            </Col>
                            <Col>
                                <Form.Label>Time:</Form.Label>
                                <Form.Control id="time" step="300" type="time" onChange={handleEventChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Event Name:</Form.Label>
                                <Form.Control id="name" onChange={handleEventChange} required />
                            </Col>
                            <Col>
                                <Form.Label>Estimated Cost:</Form.Label>
                                <Form.Control id="cost" type="number" min="0" step="1" onChange={handleEventChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Location:</Form.Label>
                            <Form.Control id="location" onChange={handleEventChange} required />
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>Description:</Form.Label>
                            <Form.Control id="description" as="textarea" onChange={handleEventChange} required />
                        </Form.Row>
                        <Form.Group id="buttonContainer">
                            <Button type="submit">Add and join event!</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}