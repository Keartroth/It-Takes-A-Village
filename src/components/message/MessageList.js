import React, { useContext, useState } from "react"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { EditMessageForm } from "../dialog/EditMessageForm"
import { MessagesContext } from "../providers/MessagesProvider"
import { UserContext } from "../providers/UsersProvider"
import "./Message.css"

export const MessageList = props => {
    const { users } = useContext(UserContext)
    const { addMessage, messages, deleteMessage, updateMessage } = useContext(MessagesContext)

    const currentUser = props.currentUserId
    const villageId = props.villageId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const date = new Date()
    const timestamp = date.getTime()

    const villageMessages = messages.filter(m => m.villageId === villageId) || []

    const [editState, setEditState] = useState({
        message: " "
    })
    const [messageState, setMessageState] = useState({
        message: "Your Message Here"
    })

    const [modal, setModal] = useState(false)
    const toggleEditForm = (message) => {
        setEditState(message)
        setModal(!modal)
    }

    const handleMessageInput = (e) => {
        const updatedState = { ...messageState }
        updatedState['message'] = e.target.value
        setMessageState(updatedState)
    }

    const sendMessage = (e) => {
        e.preventDefault()
        messageState.userId = currentUser
        messageState.villageId = villageId
        messageState.timestamp = timestamp
        addMessage(messageState)
        setMessageState({
            message: "Your Message Here"
        })
        
    }

    const nukeMessage = (messageId) => {
        deleteMessage(messageId)
    }

    return (
        <section className="messageListContainer">
            <div className="messageList__formContainer">
                <Form className="messageList__form" onSubmit={sendMessage}>
                    <Form.Group>
                        <Form.Control as="textarea" value={messageState.message} onChange={handleMessageInput} required></Form.Control>
                    </Form.Group>
                    <Form.Group id="buttonContainer">
                        <Button type="submit">Submit Message</Button>
                    </Form.Group>
                </Form>
            </div>
            <section className="messageList__board">
                {
                    villageMessages.map(vm => {
                        const mu = users.find(u => u.id === vm.userId)
                        return <Card key={vm.id} className={`message ${currentUser === vm.userId ? 'right blue' : 'left gray'}`}>
                            <Card.Title className="mb-2 text-muted message__userName">{mu.firstName} {mu.lastName}</Card.Title>
                            <Card.Body>{vm.message}</Card.Body>
                            <Card.Body className="message__buttonContainer">
                                {vm.userId === currentUser ? <Button size="sm" variant="warning" className="messageButton" onClick={() => {toggleEditForm(vm)}}>Edit</Button> : ""}
                                {vm.userId === currentUser ? <Button size="sm" variant="danger" className="messageButton" onClick={() => {nukeMessage(vm.id)}}>Delete</Button> : ""}
                                {currentUserIsProtegeCheck && currentUser !== vm.userId ? <Button size="sm" variant="danger" className="messageButton" onClick={() => {nukeMessage(vm.id)}}>Delete</Button> : ""}
                            </Card.Body>
                        </Card>
                    })
                }
            </section>

            <EditMessageForm 
                toggleEditForm={toggleEditForm}
                updateMessage={updateMessage}
                editState={editState}
                setEditState={setEditState}
                modal={modal}
                />
        </section>
    )
}