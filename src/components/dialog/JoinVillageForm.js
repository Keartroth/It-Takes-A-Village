import React, { useContext } from "react"
import Button from "react-bootstrap/Button"
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { TimePledgesContext } from "../providers/TimePledgeProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import "./Dialog.css"

export const JoinVillageForm = props => {
    const { addTimePledge } = useContext(TimePledgesContext)
    const { addTreasurePledge } = useContext(TreasurePledgesContext)
    const { addVillageUser } = useContext(VillageUsersContext)

    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const currentUserId = props.userId
    const modal = props.modal
    const toggle = props.toggle
    const setPromiseState = props.setPromiseState
    const promiseState = props.promiseState

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

        for (const timePromise of timePromiseArray) {
            let timeObject = {
                userId: currentUserId,
                villageId: villageId,
                hours: parseInt(timePromise.promiseValue),
            }
            addTimePledge(timeObject)
        }

        for (const treasurePromise of treasurePromiseArray) {
            let timeObject = {
                userId: currentUserId,
                villageId: villageId,
                amount: parseInt(treasurePromise.promiseValue),
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
        <Modal id="joinVillageModal" size="lg" show={modal} onSubmit={joinVillage}>
            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Volunteer to join {villageProtege.firstName} {villageProtege.lastName}'s village!
                    </Modal.Title>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggle}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>

            <ModalBody>
                <Container>
                    <h5>Would you like to make a monthly promise when joining?</h5>
                    <Form id="joinVillageForm">
                        {
                            promiseState.map((ps, idx) => {
                                const promiseValueId = `promiseValue-${idx}`
                                const promiseTypeId = `promiseType-${idx}`
                                return <Form.Row key={`promise-${idx}`}>
                                    <Col className="col-5">
                                        <Form.Label>Your Monthly Pledge:</Form.Label>
                                        <Form.Control className="promiseValue" value={promiseState[idx].promiseValue} id={promiseValueId} type="number" min="0" data-idx={idx} onChange={handlePromiseChange} required />
                                    </Col>
                                    <Col className="col-6">
                                        <Form.Group as={Col} id="formGridBudget">
                                            <Form.Label>Type of Pledge:</Form.Label>
                                            <Form.Control className="promiseType" as="select" value={promiseState[idx].promiseType} id={promiseTypeId} data-idx={idx} onChange={handlePromiseChange} required>
                                                <option value="">Choose...</option>
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
                            {promiseState.length === 0 ? <Button onClick={(e) => { addPromise(e) }}>Add a monthly promise</Button> : <Button onClick={(e) => { addPromise(e) }}>Add another monthly promise</Button>}
                            <Button type="submit">Join village</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}