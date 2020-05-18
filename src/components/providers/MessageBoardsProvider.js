import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const MessageBoardsContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const MessageBoardsProvider = (props) => {
    const [messageBoards, setMessageBoards] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const getMessageBoards = () => {
        return fetch("http://localhost:8088/messageBoards", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setMessageBoards)
    }

    const addMessageBoard = messageBoard => {
        return fetch("http://localhost:8088/messageBoards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(messageBoard)
        })
            .then(res => res.json())
            .then((res) => {
                const createdMessage = res
                getMessageBoards()
                return createdMessage
            })
    }

    const deleteMessageBoard = messageBoardId => {
        return fetch(`http://localhost:8088/messageBoards/${messageBoardId}`, {
            method: "DELETE",
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(getMessageBoards)
    }

    const updateMessageBoard = messageBoard => {
        return fetch(`http://localhost:8088/messageBoards/${messageBoard.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(messageBoard)
        })
            .then(getMessageBoards)
    }

    /*
        Load all messageBoards when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getMessageBoards()
    }, [])

    return (
        <MessageBoardsContext.Provider value={{
            messageBoards, addMessageBoard,
            searchTerm, setSearchTerm,
            deleteMessageBoard, updateMessageBoard
        }}>
            {props.children}
        </MessageBoardsContext.Provider>
    )
}