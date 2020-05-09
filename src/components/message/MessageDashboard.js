import React, { useState, useEffect } from "react"
import { MessageList } from "./MessageList"
import { MessageBoard } from "./MessageBoard"
import { MessageBoardsProvider } from "../providers/MessageBoardsProvider"

export const MessagDashboard = (props) => {
    const villageId = props.villageId
    const currentUserId = props.currentUserId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const villageProtege = props.villageProtege

    const [activeList, setActiveList] = useState("messageBoard")
    const [messageBoardId, setMessageBoardId] = useState(null)
    const [components, setComponents] = useState()

    const threadLink = (id) => {
        setActiveList("messageBoardThread")
        setMessageBoardId(id)
    }

    // HIGHER ORDER FUNCTION. IT RETURNS OTHER FUNCTION (i.e. COMPONENTS)
    const showMessageBoard = () => (
        <MessageBoardsProvider>
            <MessageBoard
                currentUserId={currentUserId}
                villageId={villageId}
                threadLink={threadLink}
                villageProtege={villageProtege}
            />
        </MessageBoardsProvider>
    )

    const showMessageBoardThread = () => (
        <MessageList
            villageId={villageId}
            currentUserId={currentUserId}
            messageBoardId={messageBoardId}
            setActiveList={setActiveList}
            currentUserIsProtegeCheck={currentUserIsProtegeCheck}
        />
    )

    /*
        This effect hook determines which list is shown
        based on the state of the `activeList` variable.
    */
    useEffect(() => {
        if (activeList === "messageBoard") {
            setComponents(showMessageBoard)
        }
        else if (activeList === "messageBoardThread") {
            setComponents(showMessageBoardThread)
        }
    }, [activeList, villageId])

    return (
        <section className="messageBoardMasterContainer">
            <div className="listDisplay">
                {components}
            </div>
        </section >
    )
}