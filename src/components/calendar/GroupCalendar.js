import React, { useContext, useState } from "react"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import Container from 'react-bootstrap/Container'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { RSVPEventForm } from "../dialog/RSVPEventDialog"
import { VillageEventsContext } from "../providers/VillageEventsProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./Calendar.css"

const locales = {
    'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

export const GroupCalendar = props => {
    const currentUserId = props.userId
    const { villageEvents } = useContext(VillageEventsContext)
    const { villageUsers } = useContext(VillageUsersContext)
    const [rsvpModal, setRSVPModal] = useState(false)
    const [rsvpState, setRSVPState] = useState({})

    let allTheCurrentUsersVillagesEvents = []

    const allTheCurrentUsersVillageRelationships = villageUsers.filter(vu => vu.userId === currentUserId)

    for (const villageRelationship of allTheCurrentUsersVillageRelationships) {
        allTheCurrentUsersVillagesEvents.push(villageEvents.includes(ve => ve.villageId === villageRelationship.villageId))
    }

    const mapToRBCFormat = e => Object.assign({}, e, {
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
    })


    const toggleRSVPEvent = (e) => {
        setRSVPState(e)
        setRSVPModal(!rsvpModal)
    }

    const EventComponent = (event) => {
        return <div className="calendar__event">{event.title}</div>
    }

    return (
        <Container className="calendar">
            <div className="color-keyContainer">
                <div className="color-key">
                    <div className="color-box green"></div>
                    <p>Approved Events</p>
                </div>
                <div className="color-key">
                    <div className="color-box red"></div>
                    <p>Events Awaiting Approval</p>
                </div>
            </div>

            <Calendar
                selectable
                localizer={localizer}
                views={["month", "week", "day"]}
                events={allTheCurrentUsersVillageRelationships.map(mapToRBCFormat)}
                startAccessor="startDate"
                endAccessor="endDate"
                title="title"
                components={{
                    event: EventComponent
                }}
                onSelectEvent={selected => {
                    toggleRSVPEvent(selected)
                }}
                style={{ height: 650 }}
            />

            <RSVPEventForm
                {...props}
                rsvpModal={rsvpModal}
                rsvpState={rsvpState}
                toggleRSVPEvent={toggleRSVPEvent}
            />
        </Container>
    )
}