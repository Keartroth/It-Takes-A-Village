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
    const addUserVillageEvent = props.addUserVillageEvent
    const toggleAddEvent = props.toggleAddEvent
    const eventState = props.eventState
    const setEventState = props.setEventState
    const currentUserId = parseInt(localStorage.getItem("villager"))
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const todayDate = yyyy + '-' + mm + '-' + dd

    const handleEventChange = (e) => {
        const updatedEvent = { ...eventState }
        updatedEvent[e.target.id] = e.target.value
        setEventState(updatedEvent)
    }

    const addEvent = (e) => {
        e.preventDefault()

        let eventObject = {
            villageId: villageId,
            date: eventState.date,
            time: eventState.time,
            name: eventState.name,
            description: eventState.description,
            location: eventState.location,
            cost: parseInt(eventState.cost)
        }
        addVillageEvent(eventObject)
            .then((res) => {
                let userEventObject = {
                    villageEventsId: res.id,
                    userId: currentUserId
                }
                addUserVillageEvent(userEventObject)
            })
            .then(toggleAddEvent)
    }

    return (
        <Modal id="addEventForm" show={modal} onSubmit={addEvent}>
            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Add an event to {villageProtege.firstName}'s village!
                </Modal.Title>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggleAddEvent}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Form id="addEventForm">
                        <Form.Row>
                            <Col>
                                <Form.Label>Date:</Form.Label>
                                <Form.Control id="date" type="date" min={todayDate} onChange={handleEventChange} required />
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