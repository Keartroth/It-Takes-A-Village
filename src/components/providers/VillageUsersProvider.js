import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const VillageUsersContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const VillageUsersProvider = (props) => {
    const [villageUsers, setVillageUsers] = useState([])

    const getVillageUsers = () => {
        return fetch("http://localhost:8088/villageUsers")
            .then(res => res.json())
            .then(setVillageUsers)
    }

    const addVillageUser = villageUser => {
        return fetch("http://localhost:8088/villageUsers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(villageUser)
        })
            .then(getVillageUsers)
    }

    const deleteVillageUser = villageUserId => {
        return fetch(`http://localhost:8088/villageUsers/${villageUserId}`, {
            method: "DELETE"
        })
            .then(getVillageUsers)
    }

    const updateVillageUser = villageUser => {
        return fetch(`http://localhost:8088/villageUsers/${villageUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(villageUser)
        })
            .then(getVillageUsers)
    }

    /*
        Load all villageUsers when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getVillageUsers()
    }, [])

    return (
        <VillageUsersContext.Provider value={{
            villageUsers, addVillageUser, 
            deleteVillageUser, updateVillageUser
        }}>
            {props.children}
        </VillageUsersContext.Provider>
    )
}