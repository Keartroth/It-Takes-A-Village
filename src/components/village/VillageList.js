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

    villages.map(v => {
        const villageRelationship = villageUsers.find(vu => vu.userId === currentUser && v.id === vu.villageId) || {}
        if (villageRelationship.protege === false) {
            v.patron = true
        } else if (villageRelationship.protege) {
            v.protege = true
        } else {
            v.protege = false
        }
    })

    const patronedVillageArray = villages.filter(v => v.patron === true)

    const nonMemberVillages = villages.filter((v) => !v.patron && !v.protege)

    const randomIndex = Math.floor(Math.random() * nonMemberVillages.length)

    if (nonMemberVillages.length !== 0) {
        for (const village of villages) {
            delete village.featuredVillage
        }

        const feature = nonMemberVillages[randomIndex]
        feature.featuredVillage = true

        nonMemberVillages.sort((currentObject, nextObject) => {
            const currentVillage = currentObject.lastName;
            const nextVillage = nextObject.lastName;

            if (currentVillage < nextVillage) {
                return -1
            }
            if (currentVillage > nextVillage) {
                return 1
            }
            return 0
        })

        if (randomIndex > 0) {
            nonMemberVillages.splice(randomIndex, 1)
            nonMemberVillages.unshift(feature)
        }
    }

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
                            {...props}
                            villageObject={v}
                            protege={protege}
                            villageUsers={villageUsers}
                        />
                    })
                }
            </>
        )
    }

    return (
        <section className="villageListContainer">
            {home ? <div className="villageList__header">
                <div className="villageList__text">
                    <h1>Click on a photo to see a user's description,<br /> and visit their village to volunteer<br /> OR<br /></h1>
                    <Button id="villageList--button" variant="primary" size="lg" onClick={toggle}>Create a new village</Button>
                </div>
            </div> : ""}

            <section className={home ? 'villageList homeList' : 'villageList'}>
                {home ? List(nonMemberVillages) : List(patronedVillageArray)}
            </section>

            <CreateVillageForm
                toggle={toggle}
                budgetState={budgetState}
                setBudgetState={setBudgetState}
                modal={modal}
            />
        </section>
    )
}