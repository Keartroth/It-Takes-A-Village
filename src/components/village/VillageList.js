import React, { useContext, useState } from "react"
import Button from 'react-bootstrap/Button'
import { VillagesContext } from "../providers/VillagesProvider"
import { VillagePreview } from "./VillagePreview"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import { UserContext } from "../providers/UsersProvider"
import { CreateVillageForm } from "../dialog/CreateVillageForm"
import "./Village.css"

export const VillageList = props => {
    const { users } = useContext(UserContext)
    const { villages } = useContext(VillagesContext)
    const { villageUsers } = useContext(VillageUsersContext)

    const currentUser = props.userId
    const home = props.home
    const villageLink = props.villageLink

    const villagesArrayCopy = villages.slice()
    villagesArrayCopy.map(v => {
        let villageRelationship = villageUsers.find(vu => vu.userId === currentUser && vu.protege === false) || {}
        if (villageRelationship.protege === false) {
            v.patron = true
        } else {
            v.protege = false
        }
    })
    const patronedVillageArray = villagesArrayCopy.filter(v => v.patron === true)

    const [budgetState, setBudgetState] = useState([])

    const [modal, setModal] = useState(false)
    const toggle = () => {
        setBudgetState([])
        setModal(!modal)
    }

    const List = (array) => {
        return (
            <>
                {
                    array.map(v => {
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
            <section className="villageListContainer">
                <div className="villageListContainer__header">
                    {home ? <h1>Visit a village to volunteer!</h1> : ""}
                    {home ? <Button variant="primary" onClick={toggle}>Create a village</Button> : ""}
                </div>
                <section className="villageList">
                    {home ? List(villages) : List(patronedVillageArray)}
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