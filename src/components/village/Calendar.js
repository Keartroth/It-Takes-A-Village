import React, { useContext, useState } from "react"
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container'
import { AddEventForm } from "./AddEventForm"
import { VillageEventsContext } from "../providers/VillageEventsProvider"
import { UserVillageEventsContext } from "../providers/UserVillageEventsProvider"
import "./Village.css"

export const Calendar = props => {
    const users = props.users
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const { userVillageEvents, addUserVillageEvent } = useContext(UserVillageEventsContext)
    const { villageEvents, addVillageEvent } = useContext(VillageEventsContext)
    const currentVillageEvents = villageEvents.filter(ve => ve.villageId === villageId) || []

    const [modal, setModal] = useState(false)

    const toggleCalendar = () => {
        setEventState({})
        setModal(!modal)
    }

    const [eventState, setEventState] = useState({})

    return (
        <>
            <Container className="calendar">
                <h5>{villageProtege.firstName}'s Events</h5>
                {
                    currentVillageEvents.map(cve => {
                        const currentEventUsers = userVillageEvents.filter(uve => uve.villageEventsId === cve.id) || []
                        return <div key={cve.id} className="calendar__event">
                            <h5>{cve.name}</h5>
                            <p>Date: {cve.date} Time: {cve.time}<br></br>Estimated Cost: ${cve.cost}<br></br>Event description: {cve.description}</p>
                            <h5>Attending Villagers</h5>
                            <ul>
                                {
                                    currentEventUsers.map(ceu => {
                                        const villager = users.find(u => u.id === ceu.userId)
                                        return <li key={villager.id}>{villager.firstName} {villager.lastName}</li>
                                    })
                                }
                            </ul>
                        </div>
                    })
                }

                <AddEventForm 
                    modal={modal}
                    villageId={villageId}
                    eventState={eventState}
                    setEventState={setEventState}
                    toggleCalendar={toggleCalendar}
                    villageEvents={villageEvents}
                    villageProtege={villageProtege}
                    addVillageEvent={addVillageEvent}
                    addUserVillageEvent={addUserVillageEvent}
                />

                <Button onClick={toggleCalendar}>Add an event!</Button>
            </Container>
        </>
    )
}