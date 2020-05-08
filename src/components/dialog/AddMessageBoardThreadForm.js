import React, { useState, useContext } from "react"
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { MessagesContext } from "../providers/MessagesProvider"
import { MessageBoardsContext } from "../providers/MessageBoardsProvider"
import "./Dialog.css"

export const AddMessageBoardThread = props => {
    const { addMessageBoard } = useContext(MessageBoardsContext)
    const { addMessage } = useContext(MessagesContext)
    const modal = props.modal
    const villageId = props.villageId
    const villageProtege= props.villageProtege || {}
    const toggleAddThread = props.toggleAddThread
    const currentUserId = props.currentUserId
    const today = new Date()
    const timestamp = today.getTime()

    const blankForm = {
        topic: "Your thread topic here",
        message: "Your Message Here"
    }

    const [formState, setFormState] = useState(blankForm)

    const handleFormChange = (e) => {
        const update = { ...formState }
        update[e.target.id] = e.target.value
        setFormState(update)
    }

    const addThread = (e) => {
        debugger
        e.preventDefault()
        let threadObject = {
            topic: formState.topic,
            villageId: villageId,
            timestamp: timestamp,
        }
        addMessageBoard(threadObject)
            .then((res) => {
                let messageObject = {
                    message: formState.message,
                    villageId: villageId,
                    userId: currentUserId,
                    timestamp: timestamp,
                    messageBoardId: res.id
                }
                addMessage(messageObject)
            })
            .then(toggleAddThread)
    }

    return (
        <Modal id="addThreadModal" show={modal} onSubmit={addThread}>
            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a thread to {villageProtege.firstName}'s message board!
                </Modal.Title>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={() => {
                    setFormState(blankForm)
                    toggleAddThread()
                }}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>
            <ModalBody>
                <Container>
                    <Form id="addThreadForm">
                        <Form.Group>
                            <Form.Control id="topic" value={formState.topic} onChange={handleFormChange} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control id="message" as="textarea" value={formState.message} onChange={handleFormChange} required></Form.Control>
                        </Form.Group>
                        <Form.Group id="buttonContainer">
                            <Button type="submit">Add Thread</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}