import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { TimePledgesContext } from "../providers/TimePledgeProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Dialog.css"

export const EditPledgeForm = props => {
    const { addTreasurePledge, deleteTreasurePledge, updateTreasurePledge } = useContext(TreasurePledgesContext)
    const { addTimePledge, deleteTimePledge, updateTimePledge } = useContext(TimePledgesContext)
    const userId = props.userId
    const villageId = props.villageId
    const pledgeState = props.pledgeState
    const pledgeModal = props.pledgeModal
    const toggleEditPledge = props.toggleEditPledge

    const [deletePledgeState, setDeletePledgeState] = useState([])
    const [editPledgetState, setEditPledgeState] = useState([])

    useEffect(() => {
        setEditPledgeState(pledgeState)
    }, [pledgeState])

    const blankPledge = {
        userId: userId,
        villageId: villageId,
    }

    const handlePledgeChange = (e) => {
        const updatedPledge = [...editPledgetState]
        const foundObject = updatedPledge[parseInt(e.target.dataset.idx)]

        const greatGrandparent = e.target.parentElement.parentElement
        const proptery = greatGrandparent.children[0].children[1].value
        const value = parseInt(greatGrandparent.children[1].children[1].value)

        if (e.target.value !== "") {
            if (Number.isNaN(value)) {
                delete foundObject.amount
                delete foundObject.hours
                foundObject[proptery] = 0
                setEditPledgeState(updatedPledge)
            } else {
                delete foundObject.amount
                delete foundObject.hours
                foundObject[proptery] = value
                setEditPledgeState(updatedPledge)
            }
        }
    }

    const addPledge = () => {
        setEditPledgeState([...editPledgetState, { ...blankPledge }])
    }

    const removePledge = (index) => {
        if (editPledgetState[index].id) {
            const updatedDeletePledgeState = [...deletePledgeState]
            updatedDeletePledgeState.unshift(editPledgetState[index])
            setDeletePledgeState(updatedDeletePledgeState)
        }

        const updatedBudget = [...editPledgetState]
        updatedBudget.splice(index, 1)
        setEditPledgeState(updatedBudget)
    }

    const editUserPledge = () => {
        const deletePledgeObjects = () => {
            for (const pledgeObject of deletePledgeState) {
                if (pledgeObject.amount) {
                    deleteTreasurePledge(pledgeObject.id)
                } else {
                    deleteTimePledge(pledgeObject.id)
                }
            }
        }

        const editPledgeObjects = () => {
            for (const pledgeObject of editPledgetState) {
                if (pledgeObject.id) {
                    if (pledgeObject.amount) {
                        updateTreasurePledge(pledgeObject)
                    } else {
                        updateTimePledge(pledgeObject)
                    }
                } else {
                    if (pledgeObject.amount) {
                        addTreasurePledge(pledgeObject)
                    } else {
                        addTimePledge(pledgeObject)
                    }
                }
            }
        }

        editPledgeObjects()
        deletePledgeObjects()
        toggleEditPledge()
    }

    return (
        <Modal id="editPledgeModal" size="lg" show={pledgeModal}>

            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Update your monthly pledge
                </Modal.Title>
            </ModalHeader>

            <ModalBody>
                <Container>
                    <Form id="editPledgeForm" onSubmit={(e) => {
                        e.preventDefault()
                        editUserPledge()
                    }}>
                        {
                            editPledgetState.map((ps, idx) => {
                                const promiseValueId = `promiseValue-${idx}`
                                const promiseTypeId = `promiseType-${idx}`
                                return <Form.Row key={`promise-${idx}`}>
                                    <Col className="col-6">
                                        <Form.Label>Type of Pledge:</Form.Label>
                                        <Form.Control className="promiseType" as="select" defaultValue={editPledgetState[idx].hours ? "hours" : "amount"} id={promiseTypeId} data-idx={idx} onChange={handlePledgeChange} required>
                                            <option value="">Choose...</option>
                                            <option value="hours">Time</option>
                                            <option value="amount">Treasure</option>
                                        </Form.Control>
                                    </Col>
                                    <Col className="col-5">
                                        <Form.Label>Your Monthly Pledge:</Form.Label>
                                        <Form.Control className="promiseValue" defaultValue={editPledgetState[idx].hours ? editPledgetState[idx].hours : editPledgetState[idx].amount} id={promiseValueId} type="number" min="0" data-idx={idx} onChange={handlePledgeChange} required />
                                    </Col>
                                    <Col className="col-1">
                                        <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => { removePledge(idx) }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </Col>
                                </Form.Row>
                            })
                        }
                        <Form.Group className="buttonContainer">
                            {editPledgetState.length === 0 ? <Button onClick={(e) => { addPledge(e) }}>Add a monthly pledge</Button> : ""}
                            {editPledgetState.length === 1 ? <Button onClick={(e) => { addPledge(e) }}>Add another monthly pledge</Button> : ""}
                            <Button type="submit">Save Updates</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}