import React from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import "./Dialog.css"

export const EditMessageForm = props => {
    const toggleEditForm = props.toggleEditForm
    const updateMessage = props.updateMessage
    const editState = props.editState || {}
    const setEditState = props.setEditState
    const modal = props.modal

    const handleMessageChange = (e) => {
        const updatedState = { ...editState }
        updatedState['message'] = e.target.value
        setEditState(updatedState)
    }

    const editMessage = () => {
        updateMessage(editState)
        toggleEditForm()
    }

    return (
        <Modal id="editMessageModal" show={modal} onSubmit={(e) => {
            e.preventDefault()
            editMessage()
        }}>
            <ModalBody>
                <Form id="editMessageForm">
                    <Form.Group id="editMessageTextArea">
                        <Form.Control type="textarea" value={editState.message} onChange={handleMessageChange}></Form.Control>
                    </Form.Group>
                    <Form.Group id="buttonContainer">
                        <Button type="submit">Save Updated Message</Button>
                    </Form.Group>
                </Form>
            </ModalBody>
        </Modal>
    )
}