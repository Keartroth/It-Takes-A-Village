import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { EditBudgetForm } from "../dialog/EditBudgetForm"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Village.css"

export const Budget = props => {
    const { budgets } = useContext(BudgetsContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck

    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === villageId) || []

    const [budgetState, setBudgetState] = useState([])
    const [modal, setModal] = useState(false)
    const toggleEditBudget = () => {
        setModal(!modal)
    }

    useEffect(() => {
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [budgets])

    useEffect(() => {
        debugger
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [modal])

    let budgetTotal = 0
    let pledgeTotal = 0

    budgetState.map(vb => budgetTotal = budgetTotal + vb.budgetValue)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    console.log(budgetState, "budgetState")

    return (
        <>
            <Container>
                <h5>{villageProtege.firstName}'s Monthly Services Needs</h5>
                <div>
                    <ul>
                        {
                            budgetState.map(vb => {
                                let fbt = budgetTypes.find(bt => bt.id === vb.budgetTypesId) || {}
                                return <li key={vb.id}>{fbt.type}: ${vb.budgetValue}</li>
                            })
                        }
                    </ul>
                </div>
                <h5>{villageProtege.firstName}'s Village Treasure Promises</h5>
                <div>
                    <ul>
                        {
                            filteredTreasurePledges.map(tp => {
                                return <li key={tp.id}>${tp.amount}</li>
                            })
                        }
                    </ul>
                </div>
                <div>
                    {budgetTotal - pledgeTotal === 0 ? "" : <h5>Present Monthly Need: ${budgetTotal - pledgeTotal}</h5>}
                    {currentUserIsProtegeCheck ? <Button onClick={toggleEditBudget}>Edit your monthly budget</Button> : ""}
                </div>

                <EditBudgetForm
                    toggleEditBudget={toggleEditBudget}
                    budgets={budgets}
                    budgetState={budgetState}
                    setBudgetState={setBudgetState}
                    villageId={villageId}
                    modal={modal}
                />
            </Container>
        </>
    )
}