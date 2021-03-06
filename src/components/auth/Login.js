import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Container from "react-bootstrap/Container"
import Form from 'react-bootstrap/Form'
import "./Auth.css"

export const Login = ({ toggle, setActiveList }) => {
    const [loginState, setlLginState] = useState({})
    const handleLoginChange = (e) => {
        const updatedState = { ...loginState }
        updatedState[e.target.id] = e.target.value
        setlLginState(updatedState)
    }

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${loginState.email}`)
            .then(_ => _.json())
            .then(user => {
                if (user.length) {
                    return user[0]
                }
                return false
            })
    }

    const handleLogin = (e) => {
        e.preventDefault()

        existingUserCheck()
            .then(exists => {
                if (exists) {
                    if (exists.password === loginState.password) {
                        localStorage.setItem("villager", exists.id)
                        toggle()
                    } else if (exists.password !== loginState.password) {
                        window.alert("Password does not match.")
                    }
                } else {
                    window.alert("Combination of email or password does not exist.")
                }
            })
    }

    return (
        <section className="mainContainer__login">
            <div className="login__column--left"></div>
            <div className="login__container">
                <Container>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={handleLoginChange} required />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={handleLoginChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                    </Button>
                    </Form>
                    <div className="fakeLink href registration--link" onClick={() => setActiveList("register")}>Not a villager? Register here!</div>
                </Container>
            </div>
            <div className="login__column--right"></div>
        </section>
    )
}