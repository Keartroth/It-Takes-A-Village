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

    const getBudgets = () => {
        return fetch("http://localhost:8088/budgets", {
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(res => res.json())
            .then(setBudgets)
    }

    const addBudget = budget => {
        return fetch("http://localhost:8088/budgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
            },
            body: JSON.stringify(budget)
        })
            .then(getBudgets)
    }

    const deleteBudget = budgetId => {
        return fetch(`http://localhost:8088/budgets/${budgetId}`, {
            method: "DELETE",
            headers: {
                "cache-control":"no-cache"
            }
        })
            .then(getBudgets)
    }

    const updateBudget = budget => {
        return fetch(`http://localhost:8088/budgets/${budget.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "cache-control":"no-cache"
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
            deleteBudget, updateBudget
        }}>
            {props.children}
        </BudgetsContext.Provider>
    )
}