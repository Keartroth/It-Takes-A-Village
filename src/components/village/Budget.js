import React, { useContext, useState, useEffect } from "react"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { EditBudgetForm } from "../dialog/EditBudgetForm"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Village.css"

export const Budget = props => {
    const { budgets } = useContext(BudgetsContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)
    const villageId = props.villageId
    const villageProtege = props.villageProtege
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck

    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === villageId) || []

    const [budgetState, setBudgetState] = useState([])
    const [modal, setModal] = useState(false)
    const toggleEditBudget = () => {
        setModal(!modal)
    }

    useEffect(() => {
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [budgets, villageId])

    useEffect(() => {
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [modal, villageId, budgets])

    let budgetTotal = 0
    let pledgeTotal = 0

    budgetState.map(vb => budgetTotal = budgetTotal + vb.budgetValue)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    return (
        <Container>
            <Card id="budgetCard" style={{ width: '50%' }}>
                <Card.Header id="budgetCard__title">{villageProtege.firstName} {villageProtege.lastName}'s Monthly Budget</Card.Header>
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">List of monthly expenses</Card.Subtitle>
                    <ListGroup variant="flush">
                        {
                            budgetState.map(vb => {
                                let fbt = budgetTypes.find(bt => bt.id === vb.budgetTypesId) || {}
                                return <ListGroup.Item key={vb.id}>{fbt.type}: ${vb.budgetValue}</ListGroup.Item>
                            })
                        }
                    </ListGroup>
                    <br></br>
                    <Card.Subtitle className="mb-2 text-muted">Village Monthly Pledge Total</Card.Subtitle>
                    <ListGroup variant="flush">
                        <ListGroup.Item>${pledgeTotal}</ListGroup.Item>
                    </ListGroup>
                    {currentUserIsProtegeCheck ? <Card.Footer className="text-muted"><Button onClick={toggleEditBudget}>Edit your monthly budget</Button></Card.Footer> : ""}
                </Card.Body>
            </Card>

            <EditBudgetForm
                toggleEditBudget={toggleEditBudget}
                budgets={budgets}
                budgetState={budgetState}
                setBudgetState={setBudgetState}
                villageId={villageId}
                modal={modal}
            />
        </Container>
    )
}