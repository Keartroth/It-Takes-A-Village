import React from "react"
import Button from 'react-bootstrap/Button'
import "./Village.css"

export const VillagePreview = (props) => {
    const villageUsers = props.villageUsers || []
    const villageLink = props.villageLink
    const village = props.villageObject
    const protege = props.protege
    const population = villageUsers.filter(vu => vu.villageId === village.id).length

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
                        <li>Village Need: Unknown</li>
                    </ul>
                    <Button id={`previewButton--${protege.id}`} onClick={() => { villageLink(village.id) }}>Visit this village!</Button>
                </div>
            </div>
        </div>
    )
}