import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const BudgetTypesContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const BudgetTypesProvider = (props) => {
    const [budgetTypes, setBudgetTypes] = useState([])

    const getBudgetTypes = () => {
        return fetch("http://localhost:8088/budgetTypes", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setBudgetTypes)
    }

    const addBudgetType = budgetType => {
        return fetch("http://localhost:8088/budgetTypes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(budgetType)
        })
            .then(getBudgetTypes)
    }

    /*
        Load all budgetTypes when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getBudgetTypes()
    }, [])

    return (
        <BudgetTypesContext.Provider value={{
            budgetTypes, 
            addBudgetType
        }}>
            {props.children}
        </BudgetTypesContext.Provider>
    )
}