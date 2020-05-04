import React, { useContext } from "react"
import Container from 'react-bootstrap/Container'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Village.css"

export const Budget = props => {
    const { budgets } = useContext(BudgetsContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)
    const villageId = props.villageId
    const villageProtege = props.villageProtege

    const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId) || []
    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === villageId) || []
    let budgetTotal = 0
    let pledgeTotal = 0

    filteredVillageBudgets.map(vb => budgetTotal = budgetTotal + vb.budgetValue)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    return (
        <>
            <Container>
                <h5>{villageProtege.firstName}'s Monthly Services Needs</h5>
                <div>
                    <ul>
                        {
                            filteredVillageBudgets.map(vb => {
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
                </div>
            </Container>
        </>
    )
}