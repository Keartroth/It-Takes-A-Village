import React, { useContext, useState } from "react"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import Container from 'react-bootstrap/Container'
import { AddEventForm } from "../dialog/AddEventForm"
import { VillageEventsContext } from "../providers/VillageEventsProvider"
import { UserVillageEventsContext } from "../providers/UserVillageEventsProvider"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./Village.css"
import { RSVPEventForm } from "../dialog/RSVPEventDialog"
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

export const VillageCalendar = props => {
    const currentUserId = props.currentUserId
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const { villageEvents, addVillageEvent } = useContext(VillageEventsContext)
    const { userVillageEvents, addUserVillageEvent } = useContext(UserVillageEventsContext)
    const currentVillageEvents = villageEvents.filter(ve => ve.villageId === villageId) || []
    const t = new Date()
    const year = t.getFullYear()
    const month = t.getMonth()
    const date = t.getDate()
    const day = t.getDay()
    const currentTime = format(new Date(year, month, date, day), 'ddd MMM dd yyyy')

    const mapToRBCFormat = e => Object.assign({}, e, {
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
    })

    const [modal, setModal] = useState(false)
    const [eventState, setEventState] = useState({})
    const [dateSelectedState, setDateSelectedState] = useState(" ")

    const toggleAddEvent = (selection) => {
        if (typeof selection === "string") {
            const [trash, month, day, year] = selection.split(" ")
            const dateReconstruction = month + " " + day + " " + year
            const selectedDate = format(new Date(dateReconstruction), 'yyyy-MM-dd')

            const protoEvent = {
                startDate: selectedDate,
                endDate: selectedDate
            }
            setEventState(protoEvent)
            setDateSelectedState(selectedDate)
            setModal(!modal)
        } else {
            setEventState({})
            setModal(!modal)
        }
    }

    const [rsvpState, setRSVPState] = useState({})
    const [rsvpModal, setRSVPModal] = useState(false)

    const toggleRSVPEvent = (e) => {
        setRSVPState(e)
        setRSVPModal(!rsvpModal)
    }

    const EventComponent = (event) => {
        const currentEventUsers = userVillageEvents.filter(uve => uve.villageEventsId === event.event.id) || []
        const rsvpCheck = currentEventUsers.find(ceu => ceu.userId === currentUserId)
        const protegeAttendingEventCheck = currentEventUsers.find(ceu => ceu.userId === villageProtege.id)
        return <div className={`calendar__event ${protegeAttendingEventCheck ? 'green' : 'red'}`}>{event.title}</div>
    }

    return (
        <Container className="calendar">
            <h5>{villageProtege.firstName}'s Events</h5>

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
                events={currentVillageEvents.map(mapToRBCFormat)}
                startAccessor="startDate"
                endAccessor="endDate"
                title="title"
                components={{
                    event: EventComponent
                }}
                onSelectEvent={selected => {
                    toggleRSVPEvent(selected)
                }}
                onSelectSlot={(e) => {
                    const selection = format(new Date(e.start), 'ddd MMM dd yyyy')
                    if (selection >= currentTime) {
                        toggleAddEvent(selection)
                    } else {
                        window.alert("Please select a future date. Events cannot be scheduled for past dates.")
                    }
                }}
                style={{ height: 650 }}
                onShowMore={toggleAddEvent}
            />

            <AddEventForm
                {...props}
                modal={modal}
                eventState={eventState}
                setEventState={setEventState}
                dateSelectedState={dateSelectedState}
                toggleAddEvent={toggleAddEvent}
                addVillageEvent={addVillageEvent}
                addUserVillageEvent={addUserVillageEvent}
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