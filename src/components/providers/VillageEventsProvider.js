import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const VillageEventsContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const VillageEventsProvider = (props) => {
    const [villageEvents, setVillageEvents] = useState([])

    const getVillageEvents = () => {
        return fetch("http://localhost:8088/villageEvents", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setVillageEvents)
    }

    const addVillageEvent = villageEvent => {
        return fetch("http://localhost:8088/villageEvents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(villageEvent)
        })
            .then(res => res.json())
            .then((res) => {
                const createdVillageEvent = res
                getVillageEvents()
                return createdVillageEvent
            })
    }

    const deleteVillageEvent = villageEventId => {
        return fetch(`http://localhost:8088/villageEvents/${villageEventId}`, {
            method: "DELETE",
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(getVillageEvents)
    }

    const updateVillageEvent = villageEvent => {
        return fetch(`http://localhost:8088/villageEvents/${villageEvent.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(villageEvent)
        })
            .then(getVillageEvents)
    }

    /*
        Load all villageEvents when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getVillageEvents()
    }, [])

    return (
        <VillageEventsContext.Provider value={{
            villageEvents, addVillageEvent, 
            deleteVillageEvent, updateVillageEvent
        }}>
            {props.children}
        </VillageEventsContext.Provider>
    )
}