import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const TimePledgesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const TimePledgesProvider = (props) => {
    const [timePledges, setTimePledges] = useState([])

    const getTimePledges = () => {
        return fetch("http://localhost:8088/timePledges")
            .then(res => res.json())
            .then(setTimePledges)
    }

    const addTimePledge = timePledge => {
        return fetch("http://localhost:8088/timePledges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(timePledge)
        })
            .then(getTimePledges)
    }

    const deleteTimePledge = timePledgeId => {
        return fetch(`http://localhost:8088/timePledges/${timePledgeId}`, {
            method: "DELETE"
        })
            .then(getTimePledges)
    }

    const updateTimePledge = timePledge => {
        return fetch(`http://localhost:8088/timePledges/${timePledge.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(timePledge)
        })
            .then(getTimePledges)
    }

    /*
        Load all timePledges when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getTimePledges()
    }, [])

    return (
        <TimePledgesContext.Provider value={{
            timePledges, addTimePledge, 
            deleteTimePledge, updateTimePledge
        }}>
            {props.children}
        </TimePledgesContext.Provider>
    )
}