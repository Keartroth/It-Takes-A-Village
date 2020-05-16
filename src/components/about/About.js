import React, { useContext, useEffect, useState } from "react"
import { BudgetsContext } from "../providers/BudgetsProvider"
import { FakePartnersContext } from "../providers/FakePartnersProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import { VillagesContext } from "../providers/VillagesProvider"
import './About.css'

export const About = (props) => {
    const { fakePartners } = useContext(FakePartnersContext)
    const { villages } = useContext(VillagesContext)
    const { budgets } = useContext(BudgetsContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)
    const fakePartnersArray = fakePartners

    let totalNeed = 0
    let totalDonations = 0
    let valueObject = {}
    const [valueState, setValueState] = useState(valueObject)

    useEffect(() => {
        if (budgets.length !== 0) {
            budgets.forEach(budget => totalNeed = totalNeed + budget.value)
            
            const updatedState = { ...valueState }
            updatedState.totalNeed = totalNeed
            setValueState(updatedState)
        }
    }, [budgets])

    useEffect(() => {
        if (treasurePledges.length !== 0) {
            treasurePledges.forEach(pledge => totalDonations = totalDonations + pledge.amount)
            
            const updatedState = { ...valueState }
            updatedState.totalDonations = totalDonations
            setValueState(updatedState)
        }
    }, [treasurePledges])

    return (
        <section className="about__mainContainer">
            <div className="about__information">
                <div className="about__missionStatement">
                    <h1>It Takes a Village</h1>
                    <p>Our mission is to provide an opportunity for communities to further a sense of fellowhip within their citizenry.<br></br>
                    To that end, we will strive to encourage fellowship where there is a desire, but the path to association is obstructed by custom or the guardedness we feel towards those who are unfamiliar.</p>
                </div>
                <div className="about__villageInfoTotal">
                    <p>Currently, our members are supporting {villages.length} underserved members of our community. For those {villages.length} people,
                ${valueState.totalDonations} is being donated per month to help alleviate a total estimated monthly need of ${valueState.totalNeed}.</p>

                </div>
            </div>
            <div className="about__fakePartnersList">
                <h2 id="about__fakePartnersHeader">Our Partners (**not real partners**)</h2>
                {
                    fakePartnersArray.map(fp => {
                        return <div key={fp.id} onClick={() => window.open(fp.link, '_blank')}>
                            <img className="about__partner" src={fp.logo} alt="corporate logo" />
                        </div>
                    })
                }
            </div>
        </section>
    )
}