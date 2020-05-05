import React, { useState } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import "./Auth.css"

export const RegisterForm = ({ toggle }) => {

    const [registerState, setRegisterState] = useState({})
    const handleRegisterChange = (e) => {
        const updatedState = { ...registerState }
        updatedState[e.target.id] = e.target.value
        setRegisterState(updatedState)
    }

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${registerState.email}`)
            .then(_ => _.json())
            .then(user => {
                if (user.length) {
                    return true
                }
                return false
            })
    }

    const handleRegister = (e) => {
        e.preventDefault()

        if (registerState.password === registerState.verifyPassword) {
            existingUserCheck()
                .then((result) => {
                    if (!result) {
                        registerState.address = registerState.address + ", " + registerState.city + ", " + registerState.state + ", " + registerState.zip
                        delete registerState.city
                        delete registerState.state
                        delete registerState.zip
                        delete registerState.verifyPassword
                        fetch("http://localhost:8088/users", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(registerState)
                        })
                            .then(_ => _.json())
                            .then(createdUser => {
                                if (createdUser.hasOwnProperty("id")) {
                                    localStorage.setItem("villager", createdUser.id)
                                    toggle()
                                }
                            })
                    } else {
                        window.alert("Email already in use.")
                    }
                })
        } else {
            window.alert("Passwords do not match.")
        }
    }

    return (
        <section className="registration__container">
            <Form onSubmit={handleRegister}>
                <Form.Row>
                    <Form.Group as={Col} controlId="email">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={handleRegisterChange} required />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="password">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={handleRegisterChange} required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="verifyPassword">
                        <Form.Label>Verify Password *</Form.Label>
                        <Form.Control type="password" placeholder="Verify Password" onChange={handleRegisterChange} required />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="firstName">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control placeholder="Enter First Name" onChange={handleRegisterChange} required />
                    </Form.Group>

                    <Form.Group as={Col} controlId="lastName">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control placeholder="Enter Last Name" onChange={handleRegisterChange} required />
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control placeholder="1234 Main St" onChange={handleRegisterChange} />
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control onChange={handleRegisterChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="state">
                        <Form.Label>State</Form.Label>
                        <Form.Control onChange={handleRegisterChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="zip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control type="number" onChange={handleRegisterChange} />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="image">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control placeholder="Enter Image Link" onChange={handleRegisterChange} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control onChange={handleRegisterChange} />
                    </Form.Group>
                </Form.Row>

                <Form.Text className="text-muted">
                    * Required field
                </Form.Text>
                <br />

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </section>
    )
}