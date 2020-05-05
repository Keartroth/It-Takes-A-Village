import React, { useState, useEffect } from "react"
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { About } from "../home/About"
import { FakePartnersProvider } from "../providers/FakePartnersProvider"
import { FakeTestimonialsProvider } from "../providers/FakeTestimonialsProvider"
import { Home } from "../home/Home"
import { Login } from "./Login"
import { RegisterForm } from "./RegisterForm"
import { QuotesProvider } from "../providers/QuotesProvider"
import { UserProvider } from "../providers/UsersProvider"

export const Auth = ({ toggle }) => {
    const [activeList, setActiveList] = useState("home")
    const [components, setComponents] = useState()

    // HIGHER ORDER FUNCTION. IT RETURNS OTHER FUNCTION (i.e. COMPONENTS)
    const showHome = () => (
        <QuotesProvider>
            <Home />
        </QuotesProvider>
    )

    const showAbout = () => (
        <FakeTestimonialsProvider>
            <FakePartnersProvider>
                <About />
            </FakePartnersProvider>
        </FakeTestimonialsProvider>
    )

    const showLogin = () => (
        <Login toggle={toggle} />
    )

    const showRegister = () => (
        <UserProvider>
            <RegisterForm toggle={toggle} />
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
        else if (activeList === "about") {
            setComponents(showAbout)
        }
        else if (activeList === "login") {
            setComponents(showLogin)
        }
        else if (activeList === "register") {
            setComponents(showRegister)
        }
    }, [activeList])

    return (
        <main className="mainContainer">
            <Navbar bg="warning" variant="light" expand="lg">
                <Navbar.Brand onClick={() => setActiveList("home")} >It Takes a Village</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => setActiveList("home")} >Home</Nav.Link>
                        <Nav.Link onClick={() => setActiveList("about")} >About</Nav.Link>
                        <Nav.Link onClick={() => setActiveList("login")} >Login</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <div className="listDisplay">
                {components}
            </div>
            <div className="authContainer">
                {activeList === "login" ? <div className="fakeLink href registration" onClick={() => setActiveList("register")}>Not a villager? Register here!</div> : ""}
            </div>
        </main>
    )
}