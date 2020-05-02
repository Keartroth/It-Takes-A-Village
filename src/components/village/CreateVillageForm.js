import React, { useContext, useState } from "react"
import { Modal } from "reactstrap"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { VillagesContext } from "../providers/VillagesProvider"
import { VillageUsersContext } from "../providers/VillageUsersProvider"
import { UserContext } from "../providers/UsersProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { BudgetsContext } from "../providers/BudgetsProvider"
import "./Village.css"

export const CreateVillageForm = props => {
    const { users } = useContext(UserContext)
    const { villages, addVillage } = useContext(VillagesContext)
    const { villageUsers, addVillageUser } = useContext(VillageUsersContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { addBudget } = useContext(BudgetsContext)
    const toggle = props.toggle
    const budgetState = props.budgetState
    const setBudgetState = props.setBudgetState
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

    const [villageStateChange, setVillageStateChange] = useState({})
    const handleVillageChange = (e) => {
        setVillageStateChange({
            ...villageStateChange,
            [e.target.id]: e.target.value,
        })
    }

    const blankBudget = { budgetValue: "", budgetTypesId: "" }
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

    const constructVillage = () => {
        const villageId = villages.length + 1
        const numberOfBudgetItems = budgetState.length

        for (var i = 0; i < numberOfBudgetItems; i++) {
            let budgetObject = budgetState[i]
            budgetObject.villageId = villageId
            addBudget(budgetObject)
        }

        let villageObect = {
            description: villageStateChange.description,
        }
        let villageUserObject = {
            userId: parseInt(villageStateChange.protegeId),
            villageId: villageId,
            protege: true
        }
        const promise = Promise.all([
            addVillage(villageObect),
            addVillageUser(villageUserObject),
        ])
        promise.then(toggle)
    }

    return (
            <Modal size="lg" isOpen={modal} toggle={toggle} onSubmit={constructVillage}>
                <button type="button" id="closeButton" className="close" data-dismiss="modal" aria-label="Close" onClick={toggle}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <h5 className="addVillageHeader">Add a village to our community!</h5>
                <Form id="addVillageForm">
                    <Form.Row>
                        <Form.Group as={Col} id="formGridUser">
                            <Form.Label>Select User:</Form.Label>
                            <Form.Control as="select" defaultValue="0" id="protegeId" onChange={handleVillageChange} required>
                                <option value="0">Choose...</option>
                                {
                                    users.filter(u => {
                                        let protegeCheck = villageUsers.find(vu => vu.userId === u.id && vu.protege === false)
                                        if (protegeCheck) return u
                                    }).map(fu => {
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
                            const budgetValueId = `budgetValue-${idx}`
                            const budgetTypesId = `budgetTypesId-${idx}`
                            return <Form.Row key={`budget-${idx}`}>
                                <Col className="col-5">
                                    <Form.Label>Expected Monthly Expense:</Form.Label>
                                    <Form.Control className="budgetValue" value={budgetState[idx].budgetValue} id={budgetValueId} type="number" data-idx={idx} onChange={handleBudgetChange} required />
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
                    <Form.Group id="buttonContainer">
                        {budgetState.length === 0 ? <Button onClick={(e) => { addBudgetExpense(e) }}>Add a monthly expense</Button> : <Button onClick={(e) => { addBudgetExpense(e) }}>Add another monthly expense</Button>}
                        <Button type="submit">Create village</Button>
                    </Form.Group>
                </Form>
            </Modal>
    )
}