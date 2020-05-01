import React, { useState, useEffect } from "react"
import { Login } from "./Login"
import { About } from "../home/About"
import { Home } from "../home/Home"
import { RegisterForm } from "./RegisterForm"
import { QuotesProvider } from "../providers/QuotesProvider"
import { FakeTestimonialsProvider } from "../providers/FakeTestimonialsProvider"
import { FakePartnersProvider } from "../providers/FakePartnersProvider"

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
        <RegisterForm toggle={toggle} />
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
            <div className="navBar">
                <div className="fakeLink href" onClick={() => setActiveList("home")}>Home</div>
                <div className="fakeLink href" onClick={() => setActiveList("about")}>About</div>
                <div className="fakeLink href" onClick={() => setActiveList("login")}>Login</div>
            </div>
            <div className="listDisplay">
                {components}
            </div>
            <div className="authContainer">
                {activeList === "login" ? <div className="fakeLink href" onClick={() => setActiveList("register")}>Register</div> : ""}
            </div>
        </main>
    )
}