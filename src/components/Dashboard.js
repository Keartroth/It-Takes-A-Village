import React, { useState, useEffect, useContext } from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { About } from "./about/About"
import { Account } from "./account/Account"
import { BudgetsProvider } from "./providers/BudgetsProvider"
import { BudgetTypesProvider } from "./providers/BudgetTypesProvider"
import { FakePartnersProvider } from "./providers/FakePartnersProvider"
import { TimePledgesProvider } from "./providers/TimePledgeProvider"
import { TreasurePledgesProvider } from "./providers/TreasurePledgeProvider"
import { UserProvider } from "./providers/UsersProvider"
import { UserVillageEventsProvider } from "./providers/UserVillageEventsProvider"
import { Village } from "./village/Village"
import { VillageEventsProvider } from "./providers/VillageEventsProvider"
import { VillageList } from "./village/VillageList"
import { VillagesProvider } from "./providers/VillagesProvider"
import { VillageUsersContext, VillageUsersProvider } from "./providers/VillageUsersProvider"
import './ItTakesAVillage.css'
import { MessagesProvider } from "./providers/MessagesProvider"

export const Dashboard = ({ toggle }) => {
    const { villageUsers } = useContext(VillageUsersContext)
    const [activeList, setActiveList] = useState("home")
    const [components, setComponents] = useState()
    const userId = parseInt(localStorage.getItem("villager"))
    const protegeCheck = villageUsers.find(vu => vu.userId === userId && vu.protege === true) || false
    const patronCheck = villageUsers.find(vu => vu.userId === userId && vu.protege === false) || false

    const [visitVillageId, setVisitVillageId] = useState(null)
    const [protegeState, setProtegeState] = useState(false)
    const [patronState, setPatronState] = useState(null)

    useEffect(() => {
        if (protegeCheck) {
            setProtegeState(true)
        }
    }, [protegeCheck])

    useEffect(() => {
        if (patronCheck) {
            setPatronState(true)
        }
    }, [patronCheck])

    const villageLink = (id) => {
        setVisitVillageId(id)
        if (visitVillageId === protegeCheck.villageId) {
            setActiveList("visitMyVillage")
        } else {
            setActiveList("visitVillage")
        }
    }

    // HIGHER ORDER FUNCTION. IT RETURNS OTHER FUNCTION (i.e. COMPONENTS)
    const showAbout = () => (
        <FakePartnersProvider>
            <About />
        </FakePartnersProvider>
    )

    const showHome = () => (
        <TreasurePledgesProvider>
            <BudgetsProvider>
                <BudgetTypesProvider>
                    <UserProvider>
                        <VillageUsersProvider>
                            <VillagesProvider>
                                <VillageList home={true} villageLink={villageLink} userId={userId} />
                            </VillagesProvider>
                        </VillageUsersProvider>
                    </UserProvider>
                </BudgetTypesProvider>
            </BudgetsProvider>
        </TreasurePledgesProvider>
    )

    const showPatronedVillageList = () => (
        <TreasurePledgesProvider>
            <BudgetsProvider>
                <BudgetTypesProvider>
                    <UserProvider>
                        <VillageUsersProvider>
                            <VillagesProvider>
                                <VillageList home={false} villageLink={villageLink} userId={userId} />
                            </VillagesProvider>
                        </VillageUsersProvider>
                    </UserProvider>
                </BudgetTypesProvider>
            </BudgetsProvider>
        </TreasurePledgesProvider>
    )

    const showVisitVillage = () => (
        <MessagesProvider>
            <VillageEventsProvider>
                <UserVillageEventsProvider>
                    <TimePledgesProvider>
                        <TreasurePledgesProvider>
                            <BudgetTypesProvider>
                                <BudgetsProvider>
                                    <UserProvider>
                                        <VillagesProvider>
                                            <VillageUsersProvider>
                                                <Village villageId={visitVillageId} userId={userId} />
                                            </VillageUsersProvider>
                                        </VillagesProvider>
                                    </UserProvider>
                                </BudgetsProvider>
                            </BudgetTypesProvider>
                        </TreasurePledgesProvider>
                    </TimePledgesProvider>
                </UserVillageEventsProvider>
            </VillageEventsProvider>
        </MessagesProvider>
    )

    const showVisitMyVillage = () => (
        <MessagesProvider>
            <VillageEventsProvider>
                <UserVillageEventsProvider>
                    <TimePledgesProvider>
                        <TreasurePledgesProvider>
                            <BudgetTypesProvider>
                                <BudgetsProvider>
                                    <UserProvider>
                                        <VillagesProvider>
                                            <VillageUsersProvider>
                                                <Village villageId={visitVillageId} userId={userId} />
                                            </VillageUsersProvider>
                                        </VillagesProvider>
                                    </UserProvider>
                                </BudgetsProvider>
                            </BudgetTypesProvider>
                        </TreasurePledgesProvider>
                    </TimePledgesProvider>
                </UserVillageEventsProvider>
            </VillageEventsProvider>
        </MessagesProvider>
    )

    const showAccount = () => (
        <UserProvider>
            <Account userId={userId} />
        </UserProvider>
    )

    /*
        This effect hook determines which list is shown
        based on the state of the `activeList` variable.
    */
    useEffect(() => {
        if (activeList === "home") {
            setComponents(showHome)
        }
        else if (activeList === "patronedVillageList") {
            setComponents(showPatronedVillageList)
        }
        else if (activeList === "about") {
            setComponents(showAbout)
        }
        else if (activeList === "visitVillage") {
            setComponents(showVisitVillage)
        }
        else if (activeList === "visitMyVillage") {
            setComponents(showVisitMyVillage)
        }
        else if (activeList === "account") {
            setComponents(showAccount)
        }
    }, [activeList])

    const logout = () => {
        localStorage.removeItem("villager")
        toggle()
    }

    return (
        <section id="bootstrap-overrides" className="mainContainer">
            <Navbar id="navbar" bg="warning" variant="light" expand="lg">
                <Navbar.Brand onClick={() => setActiveList("home")} >It Takes a Village</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => setActiveList("home")} >Home</Nav.Link>
                        {patronState ? <Nav.Link onClick={() => setActiveList("patronedVillageList")} >Patroned Villages</Nav.Link> : ""}
                        {protegeState ? <Nav.Link onClick={() => villageLink(protegeCheck.villageId)} >My Village</Nav.Link> : ""}
                        <Nav.Link onClick={() => setActiveList("account")} >My Account</Nav.Link>
                        <Nav.Link onClick={() => setActiveList("about")} >About</Nav.Link>
                        <Nav.Link onClick={() => logout()} >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="listDisplay">
                {components}
            </div>
        </section >
    )
}