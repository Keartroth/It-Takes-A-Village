import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const QuotesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const QuotesProvider = (props) => {
    const [quotes, setQuotes] = useState([])

    const getQuotes = () => {
        return fetch("http://localhost:8088/quotes")
            .then(res => res.json())
            .then(setQuotes)
    }

    /*
        Load all quotes when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getQuotes()
    }, [])

    return (
        <QuotesContext.Provider value={{
            quotes
        }}>
            {props.children}
        </QuotesContext.Provider>
    )
}