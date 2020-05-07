import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const VillagesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const VillagesProvider = (props) => {
    const [villages, setVillages] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const getVillages = () => {
        return fetch("http://localhost:8088/villages")
            .then(res => res.json())
            .then(setVillages)
    }

    const addVillage = village => {
        return fetch("http://localhost:8088/villages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(village)
        })
            .then(res => res.json())
            .then((res) => {
                const createdVillage = res
                getVillages()
                return createdVillage
            })
    }

    const deleteVillage = villageId => {
        return fetch(`http://localhost:8088/villages/${villageId}`, {
            method: "DELETE"
        })
            .then(getVillages)
    }

    const updateVillage = village => {
        return fetch(`http://localhost:8088/villages/${village.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(village)
        })
            .then(getVillages)
    }

    /*
        Load all villages when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getVillages()
    }, [])

    return (
        <VillagesContext.Provider value={{
            villages, addVillage,
            searchTerm, setSearchTerm,
            deleteVillage, updateVillage
        }}>
            {props.children}
        </VillagesContext.Provider>
    )
}