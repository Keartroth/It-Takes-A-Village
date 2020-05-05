import React, { useContext } from "react"
import { FakePartnersContext } from "../providers/FakePartnersProvider"
import { FakeTestimonialsContext } from "../providers/FakeTestimonialsProvider"

export const About = () => {
    const { fakePartners } = useContext(FakePartnersContext)
    const { fakeTestimonials } = useContext(FakeTestimonialsContext)
    
    const fakePartnersArray = fakePartners || []
    const fakeTestimonialsArray = fakeTestimonials || []

    return (
        <div className="about__mainContainer">
            <div className="about__imgContainer">
                <div className="about__textContainer">
                    <div className="about__missionStatement">
                        <h1>It Takes a Village</h1>
                        <h5>Our Mission</h5>
                        <p>After tribe although gift, without suspensor unless the Duke.
                        To the elegant Fenring says the nullified poison before the pre-spice
                        production but reaches Chani. The little-death passes up victim. Fenring
                        prophecizes the legend prepares the steadfast the Way. Fully Fenring
                        attacks down doubt. Gurney avoids the Hasimir, while Golden Path trains
                         the wisdom encloses.</p>
                    </div>
                    <div className="about__fakePartnersList">
                        {
                            fakePartnersArray.map(fp => {
                                return <div key={fp.id}>
                                    <h5>{fp.name}</h5>
                                    <h5 className="fakeLink href" onClick={() => window.open(fp.link, '_blank')}>{fp.link}</h5>
                                    <img src={fp.logo} alt="corporate logo" />
                                </div>
                            })
                        }
                    </div>
                    <div className="about__fakeTestimonialsList">
                        {
                            fakeTestimonialsArray.map(ft => {
                                return <div key={ft.id}>
                                    <h5>{ft.firstName} {ft.lastName}</h5>
                                    <h5>Testimonial: {ft.testimonial}</h5>
                                    <img src={ft.image} alt="thumbs up" />
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}