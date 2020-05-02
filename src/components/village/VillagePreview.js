import React, { useState, useContext, useRef } from "react"
import Button from 'react-bootstrap/Button'
import "./Village.css"

export const VillagePreview = (props) => {
    const villageLink = props.villageLink
    const village = props.villageObject
    const protege = props.protege
    return (
        <>
            <section className="village">
                <h3 className="village__label">{protege.firstName} {protege.lastName}'s Village</h3>
                <div className="village__imageWrapper">
                    <img src={protege.image} alt="smiley face" />
                </div>
                <div className="village__descriptionWrapper">
                    <p>
                        {village.description}
                    </p>
                </div>
                <Button onClick={villageLink}>Visit this village!</Button>
            </section>
        </>
    )
}