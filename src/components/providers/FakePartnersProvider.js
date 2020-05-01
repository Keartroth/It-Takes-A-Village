import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const FakePartnersContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const FakePartnersProvider = (props) => {
    const [fakePartners, setFakePartners] = useState([])

    const getFakePartners = () => {
        return fetch("http://localhost:8088/fakePartners")
            .then(res => res.json())
            .then(setFakePartners)
    }

    const addFakePartners = fakePartners => {
        return fetch("http://localhost:8088/fakePartners", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fakePartners)
        })
            .then(getFakePartners)
    }

    /*
        Load all fakePartners when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getFakePartners()
    }, [])

    return (
        <FakePartnersContext.Provider value={{
            fakePartners, addFakePartners
        }}>
            {props.children}
        </FakePartnersContext.Provider>
    )
}