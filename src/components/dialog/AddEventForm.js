import React from "react"
import Button from "react-bootstrap/Button"
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import format from 'date-fns/format'
import "./Dialog.css"

export const AddEventForm = (props) => {
    const modal = props.modal
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const addVillageEvent = props.addVillageEvent
    const addUserVillageEvent = props.addUserVillageEvent
    const toggleAddEvent = props.toggleAddEvent
    const dateSelectedState = props.dateSelectedState
    const eventState = props.eventState
    const setEventState = props.setEventState
    const currentUserId = props.userId
    const timeSelectedState = props.timeSelectedState

    const now = new Date()
    const today = format(now, 'yyyy-MM-dd')

    const handleEventChange = (e) => {
        const updatedEvent = { ...eventState }
        updatedEvent[e.target.id] = e.target.value
        setEventState(updatedEvent)
    }

    const addEvent = (e) => {
        e.preventDefault()

        const startFormat = eventState.startDate + " " + eventState.startTime + ":00"
        const endFormat = eventState.endDate + " " + eventState.endTime + ":00"

        let eventObject = {
            villageId: villageId,
            startDate: startFormat,
            endDate: endFormat,
            title: eventState.title,
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
                                <Form.Label>Start Date:</Form.Label>
                                <Form.Control id="startDate" type="date" min={today} defaultValue={dateSelectedState} onChange={handleEventChange} required />
                            </Col>
                            <Col>
                                <Form.Label>Start Time:</Form.Label>
                                <Form.Control id="startTime" step="300" type="time" defaultValue={timeSelectedState} onChange={handleEventChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>End Date:</Form.Label>
                                <Form.Control id="endDate" type="date" min={today} defaultValue={dateSelectedState} onChange={handleEventChange} required />
                            </Col>
                            <Col>
                                <Form.Label>End Time:</Form.Label>
                                <Form.Control id="endTime" step="300" type="time" onChange={handleEventChange} required />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
                                <Form.Label>Event Name:</Form.Label>
                                <Form.Control id="title" onChange={handleEventChange} required />
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