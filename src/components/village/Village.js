import React, { useContext, useState } from "react"
import Button from "react-bootstrap/Button"
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { TimePledgesContext } from "../providers/TimePledgeProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import { UserContext } from "../providers/UsersProvider"
import { VillagesContext } from "../providers/VillagesProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import "./Village.css"
import { Modal } from "reactstrap"

export const Village = props => {
    const { villages } = useContext(VillagesContext)
    const { villageUsers, addVillageUser } = useContext(VillageUsersContext)
    const { users } = useContext(UserContext)
    const { budgets } = useContext(BudgetsContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { addTimePledge } = useContext(TimePledgesContext)
    const { addTreasurePledge } = useContext(TreasurePledgesContext)

    const villageId = props.villageId
    const foundVillage = villages.find(v => v.id = villageId) || {}
    const villageBudgets = budgets.filter(b => b.villageId === villageId) || []
    const foundRelation = villageUsers.find(vu => vu.villageId === villageId && vu.protege === true) || {}
    const villageProtege = users.find(u => foundRelation.userId === u.id) || {}
    const currentUserId = parseInt(localStorage.getItem("villager"))
    const currentUserIsPatronCheck = villageUsers.find(vu => vu.villageId === villageId && vu.userId === currentUserId && vu.protege === false) || undefined
    const currentUserIsProtegeCheck = villageUsers.find(vu => vu.villageId === villageId && vu.userId === currentUserId && vu.protege === true) || undefined

    const [modal, setModal] = useState(false)
    const toggle = () => {
        setPromiseState([])
        setModal(!modal)
    }

    const [promiseState, setPromiseState] = useState([])

    const blankPromise = { promiseValue: "", promiseType: "" }
    const addPromise = (e) => {
        e.preventDefault()
        setPromiseState([...promiseState, { ...blankPromise }])
    }

    const removePromise = (index) => {
        const updatedPromises = [...promiseState]
        updatedPromises.splice(index, 1)
        setPromiseState(updatedPromises)
    }

    const handlePromiseChange = (e) => {
        const updatedPromises = [...promiseState]
        updatedPromises[parseInt(e.target.dataset.idx)][e.target.className.split(" ")[0]] = e.target.value
        setPromiseState(updatedPromises)
    }

    const joinVillage = () => {
        const timePromiseArray = promiseState.filter(p => p.promiseType === "Time")
        const treasurePromiseArray = promiseState.filter(p => p.promiseType === "Treasure")
        const numberOfTimePromises = timePromiseArray.length
        const numberOfTreasurePromises = treasurePromiseArray.length
        debugger
        for (var i = 0; i < numberOfTimePromises; i++) {
            const presentTimeObject = timePromiseArray[i]
            let timeObject = {
                userId: currentUserId,
                villageId: villageId,
                hours: parseInt(presentTimeObject.promiseValue),
            }
            addTimePledge(timeObject)
        }

        for (var i = 0; i < numberOfTreasurePromises; i++) {
            const currentTreasureObject = treasurePromiseArray[i]
            let timeObject = {
                userId: currentUserId,
                villageId: villageId,
                amount: parseInt(currentTreasureObject.promiseValue),
            }
            addTreasurePledge(timeObject)
        }

        let villageUserObject = {
            userId: currentUserId,
            villageId: villageId,
            protege: false,
        }
        addVillageUser(villageUserObject).then(toggle)
    }

    return (
        <>
            <section className="villageContainer">
                <h1>{villageProtege.firstName} {villageProtege.lastName}'s Village</h1>

                <div>
                    <h5>{villageProtege.firstName} {villageProtege.lastName}'s Monthly Service Budget</h5>
                    <ul>
                        {
                            villageBudgets.map(vb => {
                                let fbt = budgetTypes.find(bt => bt.id === vb.budgetTypesId) || {}
                                return <li key={vb.id}>{fbt.type}: {vb.budgetValue}</li>
                            })
                        }
                    </ul>
                </div>

                <div>Village Description: {foundVillage.description}</div>

                {currentUserIsPatronCheck || currentUserIsProtegeCheck ? "" : <Button onClick={toggle}>Join this village!</Button>}
            </section>

            <Modal size="lg" isOpen={modal} toggle={toggle} onSubmit={joinVillage}>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggle}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <Form id="joinVillageForm">
                    <h5>What would you like to promise?</h5>
                    {
                        promiseState.map((ps, idx) => {
                            const promiseValueId = `promiseValue-${idx}`
                            const promiseType = `promiseType-${idx}`
                            return <Form.Row key={`promise-${idx}`}>
                                <Col className="col-5">
                                    <Form.Label>Expected Monthly Contribution:</Form.Label>
                                    <Form.Control className="promiseValue" value={promiseState[idx].promiseValue} type="number" data-idx={idx} onChange={handlePromiseChange} required />
                                </Col>
                                <Col className="col-6">
                                    <Form.Group as={Col} id="formGridBudget">
                                        <Form.Label>Budget Type:</Form.Label>
                                        <Form.Control className="promiseType" as="select" value={promiseState[idx].promiseType} data-idx={idx} onChange={handlePromiseChange} required>
                                            <option>Choose...</option>
                                            <option value="Time">Time</option>
                                            <option value="Treasure">Treasure</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col className="col-1">
                                    <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => { removePromise(idx) }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </Col>
                            </Form.Row>
                        })
                    }
                    <Form.Group id="buttonContainer">
                        {promiseState.length === 0 ? <Button onClick={(e) => { addPromise(e) }}>Add a monthly promise</Button> : <Button onClick={(e) => { addPromise(e) }}>Add another monthly expense</Button>}
                        <Button type="submit">Join village</Button>
                    </Form.Group>
                </Form>
            </Modal>
        </>
    )
}