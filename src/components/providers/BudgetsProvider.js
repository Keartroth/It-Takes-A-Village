import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const BudgetsContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const BudgetsProvider = (props) => {
    const [budgets, setBudgets] = useState([])
    const [searchTerm, setSearchTerm] = useState("")

    const getBudgets = () => {
        return fetch("http://localhost:8088/budgets")
            .then(res => res.json())
            .then(setBudgets)
    }

    const addBudget = budget => {
        return fetch("http://localhost:8088/budgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(budget)
        })
            .then(getBudgets)
    }

    const deleteBudget = budgetId => {
        return fetch(`http://localhost:8088/budgets/${budgetId}`, {
            method: "DELETE"
        })
            .then(getBudgets)
    }

    const updateBudget = budget => {
        return fetch(`http://localhost:8088/budgets/${budget.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(budget)
        })
            .then(getBudgets)
    }

    /*
        Load all budgets when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getBudgets()
    }, [])

    return (
        <BudgetsContext.Provider value={{
            budgets, addBudget, 
            searchTerm, setSearchTerm,
            deleteBudget, updateBudget
        }}>
            {props.children}
        </BudgetsContext.Provider>
    )
}