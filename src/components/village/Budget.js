import React, { useContext, useState, useEffect } from "react"
import { ResponsivePie } from '@nivo/pie'
import Container from 'react-bootstrap/Container'
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

                {currentUserIsProtegeCheck ? <h6 id="budgetDirections">*Click the chart to edit your budget</h6> : ""}
            </div>

            <EditBudgetForm
                budgets={budgets}
                budgetState={budgetState}
                modal={modal}
                setBudgetState={setBudgetState}
                toggleEditBudget={toggleEditBudget}
                {...props}
            />
        </Container>
    )
}