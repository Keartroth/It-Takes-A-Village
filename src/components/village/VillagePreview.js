import React, { useContext } from "react"
import Button from 'react-bootstrap/Button'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Village.css"

export const VillagePreview = (props) => {
    const villageUsers = props.villageUsers || []
    const villageLink = props.villageLink
    const village = props.villageObject
    const protege = props.protege
    const population = villageUsers.filter(vu => vu.villageId === village.id).length

    const { budgets } = useContext(BudgetsContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)

    const filteredVillageBudgets = budgets.filter(b => b.villageId === village.id) || []
    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === village.id) || []

    let budgetTotal = 0
    let pledgeTotal = 0

    filteredVillageBudgets.map(vb => budgetTotal = budgetTotal + vb.budgetValue)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    return (
        <div className="previewCard__Container">
            <div id={`previewCard--${protege.id}`}>
                <div>
                    <img id={`previewImg--${protege.id}`} src={`${protege.image}`} alt="smiley face" />
                </div>
                <div>
                    <p id={`previewTitle--${protege.id}`}>{protege.firstName} {protege.lastName}'s Village</p>
                    <p id={`previewText--${protege.id}`}>{village.description}</p>
                    <ul id={`previewList--${protege.id}`}>
                        <li>Population: {population} {population > 1 ? "villagers" : "villager"}</li>
                        <li>Village Monetary Need: ${budgetTotal - pledgeTotal}</li>
                    </ul>
                    <Button id={`previewButton--${protege.id}`} onClick={() => { villageLink(village.id) }}>Visit this village!</Button>
                </div>
            </div>
        </div>
    )
}