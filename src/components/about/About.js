import React, { useContext } from "react"
import { FakePartnersContext } from "../providers/FakePartnersProvider"
import './About.css'

export const About = () => {
    const { fakePartners } = useContext(FakePartnersContext)

    const fakePartnersArray = fakePartners || []

    return (
        <section className="about__mainContainer">
            <div className="about__imgContainer">
                <div className="about__missionStatement">
                    <h1>It Takes a Village</h1>
                    <p>The mission of It Takes a Village is to provide an opportunity for communities to further a sense of fellowhip within their citizenry.<br></br>
                    To that end, we will strive to encourage fellowship where there is a desire, but the path to association is obstructed by custom or the guardedness we feel towards those who are unfamiliar.</p>
                </div>
                <img className="about__img" src="https://www.unitedwaycares.org/sites/unitedwaycares.org/files/pictures/EFSP1.png" alt="unity" />
            </div>
            <div className="about__colorGradient"></div>
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