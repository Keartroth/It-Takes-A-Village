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
    const home = props.home
    const population = villageUsers.filter(vu => vu.villageId === village.id).length

    const { budgets } = useContext(BudgetsContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)

    const filteredVillageBudgets = budgets.filter(b => b.villageId === village.id) || []
    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === village.id) || []

    let budgetTotal = 0
    let pledgeTotal = 0

    filteredVillageBudgets.map(vb => budgetTotal = budgetTotal + vb.value)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    return (
        <div className='previewCard__Container' id={village.featuredVillage ? 'featuredVillage' : ''}>
            {village.featuredVillage ? <h5>Featured Village</h5> : ''}
            <div id={`previewCard--${protege.id}`} onClick={(e) => {
                if (!village.featuredVillage) {
                    if (e.target.id) {
                        if (e.target.id.includes("previewImg--")) {
                            if (village.patron === true) {
                                villageLink(village.id)
                            } else {
                                const grandparentElement = e.target.parentElement.parentElement
                                const hiddenDivBoolean = grandparentElement.children[1].classList.contains("hidden")
                                if (hiddenDivBoolean) {
                                    grandparentElement.children[1].classList.remove("hidden")
                                    grandparentElement.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center"
                                    })
                                    grandparentElement.parentElement.classList.add("previewCard__containerUnhidden")
                                } else {
                                    grandparentElement.children[1].classList.add("hidden")
                                    grandparentElement.parentElement.classList.remove("previewCard__containerUnhidden")
                                }
                            }
                        }
                    }
                }
            }}>
                <div data-title={village.patron || (home && !village.featuredVillage) ? `${protege.firstName} ${protege.lastName}` : null}>
                    <img id={`previewImg--${protege.id}`} src={`${protege.image}`} alt={`${protege.firstName} ${protege.lastName} smiling`} />
                </div>
                <div id={`hiddenCard--${protege.id}`} className={village.featuredVillage ? null : 'hidden'} data-title={village.featuredVillage ? null : `Click photo again to minimize`}>
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