import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const MessagesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const MessagesProvider = (props) => {
    const [messages, setMessages] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const getMessages = () => {
        return fetch("http://localhost:8088/messages", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setMessages)
    }

    const addMessage = message => {
        return fetch("http://localhost:8088/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(message)
        })
            .then(res => res.json())
            .then((res) => {
                const createdMessage = res
                getMessages()
                return createdMessage
            })
    }

    const deleteMessage = messageId => {
        return fetch(`http://localhost:8088/messages/${messageId}`, {
            method: "DELETE",
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(getMessages)
    }

    const updateMessage = message => {
        return fetch(`http://localhost:8088/messages/${message.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(message)
        })
            .then(getMessages)
    }

    /*
        Load all messages when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getMessages()
    }, [])

    return (
        <MessagesContext.Provider value={{
            messages, addMessage,
            searchTerm, setSearchTerm,
            deleteMessage, updateMessage
        }}>
            {props.children}
        </MessagesContext.Provider>
    )
}