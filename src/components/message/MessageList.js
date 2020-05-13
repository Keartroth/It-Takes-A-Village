import React, { useContext, useState, useEffect, useRef } from "react"
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

    const currentUserId = props.userId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const messageBoardId = props.messageBoardId
    const setActiveList = props.setActiveList
    const villageId = props.villageId
    const messageListEndRef = useRef(null)
    const date = new Date()
    const timestamp = date.getTime()

    const threadMessages = messages.filter(m => m.villageId === villageId && m.messageBoardId === messageBoardId) || []
    const sortedThreadMessages = threadMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    const scrollToBottom = () => {
        const topPosition = messageListEndRef.current.offsetTop
        messageListEndRef.current.parentNode.scrollTop = topPosition
    }

    const [editState, setEditState] = useState({
        message: " "
    })

    const [messageState, setMessageState] = useState({
        message: "Your Message Here"
    })

    useEffect(scrollToBottom, [sortedThreadMessages])

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
        messageState.userId = currentUserId
        messageState.villageId = villageId
        messageState.timestamp = timestamp
        messageState.messageBoardId = messageBoardId
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
            <Button id="button--returnToBoard" onClick={() => { setActiveList("messageBoard") }}>Return to Message Board</Button>

            <section className="messageList__threadContainer">
                {
                    sortedThreadMessages.map(vm => {
                        const mu = users.find(u => u.id === vm.userId)
                        return <Card key={vm.id} className={`message ${currentUserId === vm.userId ? 'right blue' : 'left gray'}`}>
                            <Card.Title className="mb-2 text-muted message__userName">{mu.firstName} {mu.lastName}</Card.Title>
                            <Card.Body>{vm.message}</Card.Body>
                            <Card.Body className="message__buttonContainer">
                                {vm.userId === currentUserId ? <Button size="sm" variant="warning" className="messageButton" onClick={() => { toggleEditForm(vm) }}>Edit</Button> : ""}
                                {vm.userId === currentUserId ? <Button size="sm" variant="danger" className="messageButton" onClick={() => { nukeMessage(vm.id) }}>Delete</Button> : ""}
                                {currentUserIsProtegeCheck && currentUserId !== vm.userId ? <Button size="sm" variant="danger" className="messageButton" onClick={() => { nukeMessage(vm.id) }}>Delete</Button> : ""}
                            </Card.Body>
                        </Card>
                    })
                }
                <div ref={messageListEndRef} />
            </section>

            <div className="messageList__formContainer">
                <Form className="messageList__form" onSubmit={sendMessage}>
                    <Form.Group>
                        <Form.Control id="messageTextArea" as="textarea" onFocus={() => { setMessageState({ message: " " }) }} value={messageState.message} onChange={handleMessageInput} required></Form.Control>
                    </Form.Group>
                    <Form.Group id="buttonContainer">
                        <Button type="submit">Submit Message</Button>
                    </Form.Group>
                </Form>
            </div>

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