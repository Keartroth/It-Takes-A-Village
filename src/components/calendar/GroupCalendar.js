import React, { useContext, useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import Container from 'react-bootstrap/Container'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
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

export const GroupCalendar = props => {
    const currentUserId = props.userId
    const users = props.users
    const villageUsers = props.villageUsers
    const { villageEvents } = useContext(VillageEventsContext)
    const { userVillageEvents } = useContext(UserVillageEventsContext)
    const [rsvpModal, setRSVPModal] = useState(false)
    const [rsvpState, setRSVPState] = useState({})

    const [allTheCurrentUsersVillageRelationships, setAllTheCurrentUsersVillageRelationships] = useState([])
    const [allTheCurrentUsersVillagesEvents, setAllTheCurrentUsersVillagesEvents] = useState([])
    const [allTheCurrentUsersEvents, setAllTheCurrentUsersEvents] = useState([])

    const colorKey = ['#EFC050', '#B565A7', '#92A8D1', '#009B77', '#6B5B95', '#88B04B', '#955251', '#FF6F61']
    let colorKeyObjectArray = []

    useEffect(() => {
        if (villageUsers.length !== 0 && villageEvents.length !== 0) {
            setAllTheCurrentUsersVillageRelationships(villageUsers.filter(vu => vu.userId === currentUserId && vu.protege === false))
        }
    }, [villageUsers, villageEvents])

    useEffect(() => {
        let joinedArrays = []
        for (const villageRelationship of allTheCurrentUsersVillageRelationships) {
            const ves = villageEvents.filter(ve => ve.villageId === villageRelationship.villageId)
            joinedArrays = joinedArrays.concat(ves)
        }
        setAllTheCurrentUsersVillagesEvents(joinedArrays)
    }, [allTheCurrentUsersVillageRelationships])

    useEffect(() => {
        const currrentUserEvents = allTheCurrentUsersVillagesEvents.filter(atcuve => userVillageEvents.find(uve => uve.villageEventsId === atcuve.id && uve.userId === currentUserId))
        setAllTheCurrentUsersEvents(currrentUserEvents)
    }, [allTheCurrentUsersVillagesEvents])

    const mapToRBCFormat = e => Object.assign({}, e, {
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
    })

    const toggleRSVPEvent = (e) => {
        setRSVPState(e)
        setRSVPModal(!rsvpModal)
    }

    const eventStyleGetter = (event) => {
        const color = colorKeyObjectArray.find(cko => cko.villageId === event.villageId)
        const style = {
            backgroundColor: color.colorKey,
            borderRadius: '2.5px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block'
        }
        return {
            style: style
        }
    }

    return (
        <Container className="calendar">
            <div className="color-keyContainer">
                {
                    allTheCurrentUsersVillageRelationships.map((atcuvr, idx) => {
                        const protegeRelationship = villageUsers.find(vu => vu.villageId === atcuvr.villageId && vu.protege === true)
                        const protege = users.find(u => u.id === protegeRelationship.userId)
                        const colorKeyObject = {
                            villageId: atcuvr.villageId,
                            colorKey: colorKey[idx]
                        }
                        colorKeyObjectArray.push(colorKeyObject)
                        
                        return <div key={idx} className="color-key">
                            <div className="color-box" style={{backgroundColor: `${colorKey[idx]}`}}></div>
                            <p>{protege.firstName} {protege.lastName}</p>
                        </div>
                    })
                }
            </div>

            <Calendar
                selectable
                localizer={localizer}
                views={["month", "week", "day"]}
                events={allTheCurrentUsersEvents.map(mapToRBCFormat)}
                startAccessor="startDate"
                endAccessor="endDate"
                title="title"
                eventPropGetter={eventStyleGetter}
                onSelectEvent={selected => {
                    toggleRSVPEvent(selected)
                }}
                style={{ height: 650 }}
            />

            <RSVPEventForm
                {...props}
                groupCalendar={true}
                rsvpModal={rsvpModal}
                rsvpState={rsvpState}
                toggleRSVPEvent={toggleRSVPEvent}
            />
        </Container>
    )
}