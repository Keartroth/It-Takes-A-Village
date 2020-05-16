import React, { useContext, useState } from "react"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import Container from 'react-bootstrap/Container'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { AddEventForm } from "../dialog/AddEventForm"
import { RSVPEventForm } from "../dialog/RSVPEventDialog"
import { UserVillageEventsContext } from "../providers/UserVillageEventsProvider"
import { VillageEventsContext } from "../providers/VillageEventsProvider"
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

export const VillageCalendar = props => {
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const { villageEvents, addVillageEvent } = useContext(VillageEventsContext)
    const { userVillageEvents, addUserVillageEvent } = useContext(UserVillageEventsContext)
    const currentVillageEvents = villageEvents.filter(ve => ve.villageId === villageId) || []

    const mapToRBCFormat = e => Object.assign({}, e, {
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
    })

    const [modal, setModal] = useState(false)
    const [eventState, setEventState] = useState({})
    const [dateSelectedState, setDateSelectedState] = useState(" ")
    const [timeSelectedState, setTimeSelectedState] = useState(" ")

    const toggleAddEvent = (selection) => {
        if (selection instanceof Date) {
            if (selection.toLocaleTimeString() === "12:00:00 AM") {
                const formatedSelection = format(selection, 'yyyy-MM-dd')
                const protoEvent = {
                    startDate: formatedSelection,
                    endDate: formatedSelection
                }
                setEventState(protoEvent)
                setDateSelectedState(formatedSelection)
                setModal(!modal)
            } else {
                const formatedSelection = format(selection, 'yyyy-MM-dd')
                const formatedTime = format(selection, 'HH:mm')
                const protoEvent = {
                    startDate: formatedSelection,
                    endDate: formatedSelection,
                    startTime: formatedTime
                }
                setEventState(protoEvent)
                setDateSelectedState(formatedSelection)
                setTimeSelectedState(formatedTime)
                setModal(!modal)
            }

        } else {
            setEventState({})
            setDateSelectedState(" ")
            setTimeSelectedState(" ")
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
                    const selection = new Date(e.start)
                    const now = new Date()
                    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

                    if (selection.getTime() >= today.getTime()) {
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
                timeSelectedState={timeSelectedState}
                toggleAddEvent={toggleAddEvent}
                addVillageEvent={addVillageEvent}
                addUserVillageEvent={addUserVillageEvent}
            />

            <RSVPEventForm
                {...props}
                groupCalendar={false}
                rsvpModal={rsvpModal}
                rsvpState={rsvpState}
                toggleRSVPEvent={toggleRSVPEvent}
            />
        </Container>
    )
}