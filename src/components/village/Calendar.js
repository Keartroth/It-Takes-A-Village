import React, { useContext, useState } from "react"
import Button from "react-bootstrap/Button"
import Container from 'react-bootstrap/Container'
import { AddEventForm } from "../dialog/AddEventForm"
import { VillageEventsContext } from "../providers/VillageEventsProvider"
import { UserVillageEventsContext } from "../providers/UserVillageEventsProvider"
import "./Village.css"

export const Calendar = props => {
    const users = props.users
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const currentUserId = props.currentUserId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const { villageEvents, addVillageEvent, deleteVillageEvent } = useContext(VillageEventsContext)
    const { userVillageEvents, addUserVillageEvent, deleteUserVillageEvent } = useContext(UserVillageEventsContext)
    const currentVillageEvents = villageEvents.filter(ve => ve.villageId === villageId) || []

    const [modal, setModal] = useState(false)

    const toggleCalendar = () => {
        setEventState({})
        setModal(!modal)
    }

    const [eventState, setEventState] = useState({})

    const joinEvent = (eventId) => {
        let userVillageEvent = {
            villageEventsId: eventId,
            userId: currentUserId
        }
        addUserVillageEvent(userVillageEvent)
    }

    const leaveEvent = (currentEventUsers) => {
        const foundEventUser = currentEventUsers.find(ceu => ceu.userId === currentUserId)
        deleteUserVillageEvent(foundEventUser.id)
    }

    const cancelEvent = (eventId) => {
        deleteVillageEvent(eventId)
    }

    return (
        <>
            <Container className="calendar">
                <h5>{villageProtege.firstName}'s Events</h5>
                {
                    currentVillageEvents.map(cve => {
                        const currentEventUsers = userVillageEvents.filter(uve => uve.villageEventsId === cve.id) || []
                        const rsvpCheck = currentEventUsers.find(ceu => ceu.userId === currentUserId)
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

                            {rsvpCheck ? <Button onClick={() => { leaveEvent(currentEventUsers) }}>Leave this event</Button> : <Button onClick={() => { joinEvent(cve.id) }}>Join this event</Button>}
                            {currentUserIsProtegeCheck ? <Button onClick={() => { cancelEvent(cve.id) }}>Cancel this event</Button> : ""}
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