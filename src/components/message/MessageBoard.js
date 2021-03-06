import React, { useState, useContext } from "react"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import { AddMessageBoardThread } from "../dialog/AddMessageBoardThreadForm"
import { MessageBoardsContext } from "../providers/MessageBoardsProvider"
import "./Message.css"

export const MessageBoard = props => {
    const threadLink = props.threadLink
    const villageId = props.villageId
    const { messageBoards } = useContext(MessageBoardsContext)

    const villageThreads = messageBoards.filter(mb => mb.villageId === villageId) || []
    const sortedThreads = villageThreads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    const [modal, setModal] = useState(false)
    const toggleAddThread = () => {
        setModal(!modal)
    }

    return (
        <section className="messageBoardContainer">
            <Button size="lg" id="button--createThread" variant="success" onClick={toggleAddThread}>Start a Conversation</Button>
            <section className="messageBoard__listContainer">
                {
                    sortedThreads.map(st => {
                        return <Card key={st.id} onClick={() => {
                            threadLink(st.id)
                        }} body>{st.topic}</Card>
                    })
                }
            </section>

            <AddMessageBoardThread
                {...props}
                modal={modal}
                toggleAddThread={toggleAddThread}
            />
        </section>
    )
}