import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { BudgetsContext } from "../providers/BudgetsProvider"
import "./Dialog.css"

export const EditBudgetForm = props => {
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { addBudget, deleteBudget, updateBudget } = useContext(BudgetsContext)

    const toggleEditBudget = props.toggleEditBudget
    const budgetState = props.budgetState
    const villageId = props.villageId
    const modal = props.modal

    const organizedBudgetTypes = budgetTypes.sort((currentObject, nextObject) => {
        const currentBudgetType = currentObject.type
        const nextBudgetType = nextObject.type

        if (currentBudgetType < nextBudgetType) {
            return -1
        }
        if (currentBudgetType > nextBudgetType) {
            return 1
        }
        return 0
    }) || []

    const [deleteBudgetState, setDeleteBudgetState] = useState([])
    const [editBudgetState, setEditBudgetState] = useState([])

    useEffect(() => {
        setEditBudgetState(budgetState)
    }, [budgetState])

    const blankBudget = { value: "", budgetTypesId: "" }

    const handleBudgetChange = (e) => {
        const updatedBudget = [...editBudgetState]
        if (e.target.value !== "") {
            updatedBudget[parseInt(e.target.dataset.idx)][e.target.className.split(" ")[0]] = parseInt(e.target.value)
            setEditBudgetState(updatedBudget)
        } else {
            updatedBudget[parseInt(e.target.dataset.idx)][e.target.className.split(" ")[0]] = e.target.value
            setEditBudgetState(updatedBudget)
        }
    }

    const addBudgetExpense = () => {
        setEditBudgetState([...editBudgetState, { ...blankBudget }])
    }

    const removeBudgetExpense = (index) => {

        if (editBudgetState[index].id) {
            const updatedBudget = [...deleteBudgetState]
            updatedBudget.unshift(editBudgetState[index])
            setDeleteBudgetState(updatedBudget)
        }
        
        const updatedBudget = [...editBudgetState]
        updatedBudget.splice(index, 1)
        setEditBudgetState(updatedBudget)
    }

    const editVillageBudget = () => {
        
        const deleteBudgetObjects = () => {
            for (const budgetObject of deleteBudgetState) {
                deleteBudget(budgetObject.id)
            }
        }

        const editBudgetObjects = () => {
            for (const budgetObject of editBudgetState) {
                if (budgetObject.id) {
                    updateBudget(budgetObject)
                } else {
                    budgetObject.villageId = villageId
                    budgetObject.label = "Nivo requires a label"
                    addBudget(budgetObject)
                }
            }
        }

        editBudgetObjects()
        deleteBudgetObjects()
        toggleEditBudget()
    }

    return (
        <Modal id="editBudgetModal" size="lg" show={modal} onSubmit={(e) => {
            e.preventDefault()
            editVillageBudget()
        }}>

            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Update your village's monthly budget
                </Modal.Title>
            </ModalHeader>

            <ModalBody>
                <Container>
                    <Form id="editBudgetForm">
                        {
                            editBudgetState.map((bs, idx) => {
                                const valueId = `value-${idx}`
                                const budgetTypesId = `budgetTypesId-${idx}`
                                return <Form.Row key={`budget-${idx}`}>
                                    <Col className="col-5">
                                        <Form.Label>Expected Monthly Expense:</Form.Label>
                                        <Form.Control className="value" value={editBudgetState[idx].value} id={valueId} type="number" min="0" data-idx={idx} onChange={handleBudgetChange} required />
                                    </Col>
                                    <Col className="col-6">
                                        <Form.Group as={Col} id="formGridBudget">
                                            <Form.Label>Budget Type:</Form.Label>
                                            <Form.Control className="budgetTypesId" id={budgetTypesId} as="select" value={editBudgetState[idx].budgetTypesId} data-idx={idx} onChange={handleBudgetChange} required>
                                                <option value="">Choose...</option>
                                                {
                                                    organizedBudgetTypes.map(bt => {
                                                        return <option key={bt.id} value={bt.id}>{bt.type}</option>
                                                    })
                                                }
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col className="col-1">
                                        <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => { removeBudgetExpense(idx) }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </Col>
                                </Form.Row>
                            })
                        }
                        <Form.Group id="buttonContainer">
                            {editBudgetState.length === 0 ? <Button onClick={(e) => { addBudgetExpense(e) }}>Add a monthly expense</Button> : <Button onClick={(e) => { addBudgetExpense(e) }}>Add another monthly expense</Button>}
                            <Button type="submit">Save Updated Budget</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}