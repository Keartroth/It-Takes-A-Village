import React, { useState, useEffect, useContext } from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { FakePartnersProvider } from "./providers/FakePartnersProvider"
import { FakeTestimonialsProvider } from "./providers/FakeTestimonialsProvider"
import { QuotesProvider } from "./providers/QuotesProvider"
import { UserProvider } from "./providers/UsersProvider"
import { VillageUsersContext, VillageUsersProvider } from "./providers/VillageUsersProvider"
import { VillagesProvider } from "./providers/VillagesProvider"
import { BudgetTypesProvider } from "./providers/BudgetTypesProvider"
import { VillageList } from "./village/VillageList"
import { BudgetsProvider } from "./providers/BudgetsProvider"



export const Dashboard = ({ toggle }) => {
    const { villageUsers } = useContext(VillageUsersContext)
    const [activeList, setActiveList] = useState("home")
    const [components, setComponents] = useState()
    const userId = parseInt(localStorage.getItem("villager"))
    const protegeCheck = villageUsers.find(vu => vu.userId === userId && vu.protege === true)

    const villageLink = () => {
        setActiveList("previewVillage")
    }

    // HIGHER ORDER FUNCTION. IT RETURNS OTHER FUNCTION (i.e. COMPONENTS)
    const showHome = () => (
        <BudgetsProvider>
            <BudgetTypesProvider>
                <UserProvider>
                    <VillageUsersProvider>
                        <VillagesProvider>
                            <VillageList home={true} villageLink={villageLink} />
                        </VillagesProvider>
                    </VillageUsersProvider>
                </UserProvider>
            </BudgetTypesProvider>
        </BudgetsProvider>
    )

    /*
        This effect hook determines which list is shown
        based on the state of the `activeList` variable.
    */
    useEffect(() => {
        if (activeList === "home") {
            setComponents(showHome)
        }
    }, [activeList])

    const logout = () => {
        localStorage.removeItem("villager")
        toggle()
    }

    return (
        <div className="mainContainer">
            <Navbar bg="warning" variant="light" expand="lg">
                <Navbar.Brand onClick={() => setActiveList("home")} >It Takes a Village</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => setActiveList("home")} >Home</Nav.Link>
                        {protegeCheck ? <Nav.Link onClick={() => setActiveList("myVillalge")} >My Village</Nav.Link> : ""}
                        <Nav.Link onClick={() => setActiveList("patronedVillageList")} >Patroned Villages</Nav.Link>
                        <Nav.Link onClick={() => setActiveList("account")} >Account</Nav.Link>
                        <Nav.Link onClick={() => setActiveList("about")} >About</Nav.Link>
                        <Nav.Link onClick={() => logout()} >Logout</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div className="listDisplay">
                {components}
            </div>
        </div >
    )
}