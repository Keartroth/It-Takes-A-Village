import React, { useContext, useState } from "react"
import Button from "react-bootstrap/Button"
import { UserContext } from "../providers/UsersProvider"
import { VillagesContext } from "../providers/VillagesProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import { Budget } from "./Budget"
import { Calendar } from "./Calendar"
import { JoinVillageForm } from "../dialog/JoinVillageForm"
import "./Village.css"

export const Village = props => {
    const currentUserId = props.userId
    const villageId = props.villageId

    const { users } = useContext(UserContext)
    const { villages } = useContext(VillagesContext)
    const { villageUsers } = useContext(VillageUsersContext)

    const foundVillage = villages.find(v => v.id = villageId) || {}
    const foundRelation = villageUsers.find(vu => vu.villageId === villageId && vu.protege === true) || {}
    const villageProtege = users.find(u => foundRelation.userId === u.id) || {}
    const currentUserIsPatronCheck = villageUsers.find(vu => vu.villageId === villageId && vu.userId === currentUserId && vu.protege === false) || undefined
    const currentUserIsProtegeCheck = villageUsers.find(vu => vu.villageId === villageId && vu.userId === currentUserId && vu.protege === true) || undefined

    const [modal, setModal] = useState(false)
    const toggle = () => {
        setPromiseState([])
        setModal(!modal)
    }

    const [promiseState, setPromiseState] = useState([])

    return (
        <section className="villageContainer">
            <div id="heroImageContainer">
                <div>
                    <img id="heroImage__image" src={villageProtege.image} alt={`${villageProtege.firstName} ${villageProtege.lastName} smiling`} />
                </div>
                <div>
                    <h1>{villageProtege.firstName} {villageProtege.lastName}'s Village</h1>
                    <div id="heroImage__description">{foundVillage.description}</div>
                </div>
            </div>

            {currentUserIsPatronCheck || currentUserIsProtegeCheck ? <Calendar
                users={users}
                villageId={villageId}
                currentUserId={currentUserId}
                villageProtege={villageProtege}
                currentUserIsProtegeCheck={currentUserIsProtegeCheck}
            /> : ""}

            <Budget
                villageId={villageId}
                villageProtege={villageProtege}
                currentUserIsProtegeCheck={currentUserIsProtegeCheck}
            />

            {currentUserIsPatronCheck || currentUserIsProtegeCheck ? "" : <Button onClick={toggle}>Join this village!</Button>}

            {currentUserIsPatronCheck || currentUserIsProtegeCheck ? "" : <JoinVillageForm
                villageId={villageId}
                villageProtege={villageProtege}
                currentUserId={currentUserId}
                modal={modal}
                toggle={toggle}
                setPromiseState={setPromiseState}
                promiseState={promiseState}
            />}
        </section>
    )
}