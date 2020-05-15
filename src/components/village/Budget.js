import React, { useContext, useState, useEffect } from "react"
import { ResponsivePie } from '@nivo/pie'
import Container from 'react-bootstrap/Container'
import { BudgetsContext } from "../providers/BudgetsProvider"
import { BudgetTypesContext } from "../providers/BudgetTypesProvider"
import { EditBudgetForm } from "../dialog/EditBudgetForm"
import { EditPledgeForm } from "../dialog/EditPledgeForm"
import { TimePledgesContext } from "../providers/TimePledgeProvider"
import { TreasurePledgesContext } from "../providers/TreasurePledgeProvider"
import "./Village.css"

export const Budget = props => {
    const { budgets } = useContext(BudgetsContext)
    const { budgetTypes } = useContext(BudgetTypesContext)
    const { treasurePledges } = useContext(TreasurePledgesContext)
    const { timePledges } = useContext(TimePledgesContext)
    const villageId = props.villageId
    const userId = props.userId
    const currentUserIsProtegeCheck = props.currentUserIsProtegeCheck
    const currentUserIsPatronCheck = props.currentUserIsPatronCheck

    const filteredTreasurePledges = treasurePledges.filter(tp => tp.villageId === villageId) || []

    const [budgetState, setBudgetState] = useState([])
    const [modal, setModal] = useState(false)
    const toggleEditBudget = () => {
        setModal(!modal)
    }

    const [pledgeState, setPledgeState] = useState([])
    const [pledgeModal, setPledgeModal] = useState(false)
    const toggleEditPledge = () => {
        setPledgeModal(!pledgeModal)
    }

    useEffect(() => {
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [budgets, villageId])

    useEffect(() => {
        const filteredVillageBudgets = budgets.filter(b => b.villageId === villageId)
        setBudgetState(filteredVillageBudgets)
    }, [modal, villageId, budgets])

    useEffect(() => {
        const currentUserTreasurePledges = treasurePledges.filter(tp => tp.villageId === villageId && tp.userId === userId)
        const currentUserTimePledges = timePledges.filter(tp => tp.villageId === villageId && tp.userId === userId)
        const pledgeArray = currentUserTimePledges.concat(currentUserTreasurePledges)
        setPledgeState(pledgeArray)
    }, [treasurePledges, timePledges, villageId, userId])

    let budgetTotal = 0
    let pledgeTotal = 0

    budgetState.map(vb => budgetTotal = budgetTotal + vb.value)
    filteredTreasurePledges.map(tp => pledgeTotal = pledgeTotal + tp.amount)

    let budgetOverview = [
        {
            id: "Monthly Pledges",
            label: "Monthly Pledges",
            value: pledgeTotal,
            color: "rgb(125, 255, 38)"
        },
        {
            id: "Unmet Budget Needs",
            label: "Unmet Budget Needs",
            value: budgetTotal - pledgeTotal,
            color: "rgb(255, 239, 0)"
        }
    ]

    return (
        <Container>
            <div id="budgetContainer">
                <ResponsivePie
                    data={budgetState}
                    animate={true}
                    borderColor={{ from: 'color', modifiers: [['darker', '0.3']] }}
                    borderWidth={1}
                    colors={{ scheme: 'pastel1' }}
                    cornerRadius={3}
                    innerRadius={0.4}
                    isInteractive={false}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    motionDamping={15}
                    motionStiffness={90}
                    onClick={() => {
                        if (currentUserIsProtegeCheck) {
                            toggleEditBudget()
                        }
                    }}
                    padAngle={0.7}
                    radialLabel={(e) => {
                        let fbt = budgetTypes.find(bt => bt.id === e.budgetTypesId) || {}
                        return fbt.type
                    }}
                    radialLabelsLinkColor="black"
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkOffset={-1}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsSkipAngle={0}
                    radialLabelsTextColor="#333333"
                    radialLabelsTextXOffset={6}
                    sliceLabel={(e) => { return `$${e.value}` }}
                    slicesLabelsSkipAngle={0}
                    slicesLabelFontSize={2}
                    slicesLabelsTextColor="#333333"
                    sortByValue={true}
                    theme={{
                        labels: {
                            text: {
                                fontSize: 20,
                            }
                        }
                    }}
                />

                <div id="budgetOverlay">
                    <ResponsivePie
                        data={budgetOverview}
                        animate={true}
                        borderColor={{ from: 'color', modifiers: [['darker', '0.3']] }}
                        borderWidth={1}
                        colors={d => d.color}
                        enableRadialLabels={false}
                        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        motionDamping={15}
                        motionStiffness={90}
                        onClick={() => {
                            if (currentUserIsPatronCheck) {
                                toggleEditPledge()
                            }
                        }}
                        padAngle={1}
                        sliceLabel={(e) => { return `$${e.value}` }}
                        slicesLabelsSkipAngle={0}
                        slicesLabelsTextColor="#333333"
                        theme={{
                            labels: {
                                text: {
                                    fontSize: 20,
                                }
                            }
                        }}
                        tooltip={(e) => { return e.label }}
                    />
                </div>

                {currentUserIsProtegeCheck ? <h6 id="budgetDirections">*Click the outer pie chart to edit your monthly budget</h6> : ""}
                {currentUserIsPatronCheck ? <h6 id="budgetDirections">*Click the inner pie chart to edit your monthly pledge</h6> : ""}
            </div>

            <EditBudgetForm
                {...props}
                budgets={budgets}
                budgetState={budgetState}
                modal={modal}
                setBudgetState={setBudgetState}
                toggleEditBudget={toggleEditBudget}
            />

            <EditPledgeForm
                {...props}
                pledgeState={pledgeState}
                pledgeModal={pledgeModal}
                setPledgeState={setPledgeState}
                toggleEditPledge={toggleEditPledge}
            />
        </Container>
    )
}