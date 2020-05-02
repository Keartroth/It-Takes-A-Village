import React, { useContext, useState } from "react"
import Button from 'react-bootstrap/Button'
import { VillagesContext } from "../providers/VillagesProvider"
import { VillagePreview } from "./VillagePreview"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import { UserContext } from "../providers/UsersProvider"
import { CreateVillageForm } from "./CreateVillageForm"
import "./Village.css"

export const VillageList = props => {
    const { users } = useContext(UserContext)
    const { villages } = useContext(VillagesContext)
    const { villageUsers } = useContext(VillageUsersContext)

    const home = props.home
    const villageLink = props.villageLink
    const currentUser = parseInt(localStorage.getItem("villager"))
    const patronedVillageArray = villages.filter(v => {
        let patronedVillage = villageUsers.find(vu => vu.userId === currentUser && vu.protege === false)
        if (patronedVillage) return v
    })

    const [budgetState, setBudgetState] = useState([])

    const [modal, setModal] = useState(false)
    const toggle = () => {
        setBudgetState([])
        setModal(!modal)
    }

    const homeList = () => {
        return (
            <>
                {
                    villages.map(v => {
                        const foundRelationship = villageUsers.find(vu => vu.villageId === v.id && vu.protege === true) || []
                        const protege = users.find(u => u.id === foundRelationship.userId) || {}

                        return <VillagePreview key={v.id}
                            villageLink={villageLink}
                            villageObject={v}
                            protege={protege}
                        />
                    })
                }
            </>
        )
    }

    const patronList = () => {
        return (
            <>
                {patronedVillageArray.length === 0 ? <h1>You haven't patroned any villages, yet. Visit the home screen to view villages to join!</h1> : ""}
                {
                    patronedVillageArray.map(v => {
                        const foundRelationship = villageUsers.find(vu => vu.villageId === v.id && vu.protege === true) || []
                        const protege = users.find(u => u.id === foundRelationship.userId) || {}

                        return <VillagePreview key={v.id}
                            villageLink={villageLink}
                            villageObject={v}
                            protege={protege}
                        />
                    })
                }
            </>
        )
    }

    return (
        <>
            <section className="villageContainer">
                <div className="villageContainer__header">
                    {home ? <h1>Visit a village to volunteer!</h1> : ""}
                    {home ? <Button variant="primary" onClick={toggle}>Create a village</Button> : ""}
                </div>
                <section className="villalgesList">
                    {home ? homeList() : patronList()}
                </section>

                <CreateVillageForm
                    toggle={toggle}
                    budgetState={budgetState}
                    setBudgetState={setBudgetState}
                    modal={modal}
                />
            </section>
        </>
    )
}