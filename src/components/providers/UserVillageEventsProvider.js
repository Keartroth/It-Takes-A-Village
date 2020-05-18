import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const UserVillageEventsContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const UserVillageEventsProvider = (props) => {
    const [userVillageEvents, setUserVillageEvents] = useState([])

    const getUserVillageEvents = () => {
        return fetch("http://localhost:8088/userVillageEvents", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setUserVillageEvents)
    }

    const addUserVillageEvent = userVillageEvent => {
        return fetch("http://localhost:8088/userVillageEvents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(userVillageEvent)
        })
            .then(getUserVillageEvents)
    }

    const deleteUserVillageEvent = userVillageEventId => {
        return fetch(`http://localhost:8088/userVillageEvents/${userVillageEventId}`, {
            method: "DELETE",
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(getUserVillageEvents)
    }

    const editUserVillageEvent = userVillageEvent => {
        return fetch(`http://localhost:8088/userVillageEvents/${userVillageEvent.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(userVillageEvent)
        })
            .then(getUserVillageEvents)
    }

    /*
        Load all userVillageEvents when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getUserVillageEvents()
    }, [])

    return (
        <UserVillageEventsContext.Provider value={{
            userVillageEvents, addUserVillageEvent, 
            deleteUserVillageEvent, editUserVillageEvent
        }}>
            {props.children}
        </UserVillageEventsContext.Provider>
    )
}