import React, { useContext, useState } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import ModalBody from 'react-bootstrap/ModalBody'
import ModalHeader from 'react-bootstrap/ModalHeader'
import { VillagesContext } from "../providers/VillagesProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import { UserContext } from "../providers/UsersProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { BudgetsContext } from "../providers/BudgetsProvider"
import "./Dialog.css"

export const CreateVillageForm = props => {
    const { users } = useContext(UserContext)
    const { addVillage } = useContext(VillagesContext)
    const { villageUsers, addVillageUser } = useContext(VillageUsersContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { addBudget } = useContext(BudgetsContext)

    const toggle = props.toggle
    const budgetState = props.budgetState
    const setBudgetState = props.setBudgetState
    const modal = props.modal
    const userArrayCopy = users.slice() || []
    userArrayCopy.map(uc => {
        let protegeCheck = villageUsers.find(vu => vu.userId === uc.id) || {}
        if (protegeCheck.protege) {
            uc.protege = true
        } else {
            uc.protege = false
        }
    })

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

    const [villageStateChange, setVillageStateChange] = useState({})
    const handleVillageChange = (e) => {
        setVillageStateChange({
            ...villageStateChange,
            [e.target.id]: e.target.value,
        })
    }

    const blankBudget = { value: "", budgetTypesId: "" }
    const addBudgetExpense = (e) => {
        e.preventDefault()
        setBudgetState([...budgetState, { ...blankBudget }])
    }

    const removeBudgetExpense = (index) => {
        const updatedBudget = [...budgetState]
        updatedBudget.splice(index, 1)
        setBudgetState(updatedBudget)
    }

    const handleBudgetChange = (e) => {
        const updatedBudget = [...budgetState]
        updatedBudget[parseInt(e.target.dataset.idx)][e.target.className.split(" ")[0]] = parseInt(e.target.value)
        setBudgetState(updatedBudget)
    }

    const constructVillage = (e) => {
        e.preventDefault()

        let villageObect = {
            description: villageStateChange.description,
        }

        addVillage(villageObect)
            .then((res) => {
                for (const budgetObject of budgetState) {
                    budgetObject.villageId = res.id
                    budgetObject.label = "Nivo requires a label"
                    addBudget(budgetObject)
                }

                let villageUserObject = {
                    userId: parseInt(villageStateChange.protegeId),
                    villageId: res.id,
                    protege: true
                }
                addVillageUser(villageUserObject)
            })
            .then(toggle)
    }

    return (
        <Modal id="createVillageModal" size="lg" show={modal} onSubmit={constructVillage}>

            <ModalHeader id="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a village to our community!
                </Modal.Title>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggle}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </ModalHeader>

            <ModalBody>
                <Container>
                    <Form id="addVillageForm">
                        <Form.Row>
                            <Form.Group as={Col} id="formGridUser">
                                <Form.Label>Select User:</Form.Label>
                                <Form.Control as="select" defaultValue="0" id="protegeId" onChange={handleVillageChange} required>
                                    <option value="">Choose...</option>
                                    {
                                        userArrayCopy.filter(u => u.protege === false).map(fu => {
                                            return <option key={fu.id} value={fu.id}>{fu.firstName} {fu.lastName}</option>
                                        })
                                    }
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} id="formGridDescription">
                                <Form.Label>Village Description:</Form.Label>
                                <Form.Control as="textarea" id="description" onChange={handleVillageChange} required>
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        {
                            budgetState.map((bs, idx) => {
                                const valueId = `value-${idx}`
                                const budgetTypesId = `budgetTypesId-${idx}`
                                return <Form.Row key={`budget-${idx}`}>
                                    <Col className="col-5">
                                        <Form.Label>Expected Monthly Expense:</Form.Label>
                                        <Form.Control className="value" value={budgetState[idx].value} id={valueId} type="number" min="0" data-idx={idx} onChange={handleBudgetChange} required />
                                    </Col>
                                    <Col className="col-6">
                                        <Form.Group as={Col} id="formGridBudget">
                                            <Form.Label>Budget Type:</Form.Label>
                                            <Form.Control className="budgetTypesId" id={budgetTypesId} as="select" value={budgetState[idx].budgetTypesId} data-idx={idx} onChange={handleBudgetChange} required>
                                                <option>Choose...</option>
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
                        <Form.Group className="buttonContainer">
                            {budgetState.length === 0 ? <Button onClick={(e) => { addBudgetExpense(e) }}>Add a monthly expense</Button> : ""}
                            {budgetState.length !== 0 && budgetState.length < 9 ? <Button onClick={(e) => { addBudgetExpense(e) }}>Add another monthly expense</Button> : ""}
                            <Button type="submit">Create village</Button>
                        </Form.Group>
                    </Form>
                </Container>
            </ModalBody>
        </Modal>
    )
}