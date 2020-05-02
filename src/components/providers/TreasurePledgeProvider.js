import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const TreasurePledgesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const TreasurePledgesProvider = (props) => {
    const [treasurePledges, setTreasurePledges] = useState([])

    const getTreasurePledges = () => {
        return fetch("http://localhost:8088/treasurePledges")
            .then(res => res.json())
            .then(setTreasurePledges)
    }

    const addTreasurePledge = treasurePledge => {
        return fetch("http://localhost:8088/treasurePledges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(treasurePledge)
        })
            .then(getTreasurePledges)
    }

    const deleteTreasurePledge = treasurePledgeId => {
        return fetch(`http://localhost:8088/treasurePledges/${treasurePledgeId}`, {
            method: "DELETE"
        })
            .then(getTreasurePledges)
    }

    const updateTreasurePledge = treasurePledge => {
        return fetch(`http://localhost:8088/treasurePledges/${treasurePledge.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(treasurePledge)
        })
            .then(getTreasurePledges)
    }

    /*
        Load all treasurePledges when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        gettreasurePledgess()
    }, [])

    return (
        <TreasurePledgesContext.Provider value={{
            treasurePledges, addTreasurePledge, 
            deleteTreasurePledge, updateTreasurePledge
        }}>
            {props.children}
        </TreasurePledgesContext.Provider>
    )
}