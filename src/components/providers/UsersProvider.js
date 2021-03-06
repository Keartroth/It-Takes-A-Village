import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const UserContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const UserProvider = (props) => {
    const [users, setUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const getUsers = () => {
        return fetch("http://localhost:8088/users", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setUsers)
    }

    const addUser = user => {
        return fetch("http://localhost:8088/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(user)
        })
            .then(getUsers)
    }

    const updateUser = user => {
        return fetch(`http://localhost:8088/users/${user.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(user)
        })
            .then(getUsers)
    }

    /*
        Load all users when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getUsers()
    }, [])

    return (
        <UserContext.Provider value={{
            users, addUser, 
            searchTerm, setSearchTerm,
            updateUser
        }}>
            {props.children}
        </UserContext.Provider>
    )
}