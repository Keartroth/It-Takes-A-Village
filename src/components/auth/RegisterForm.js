import React, { useRef } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import "./Auth.css"

export const RegisterForm = ({ toggle }) => {
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const password = useRef()
    const verifyPassword = useRef()
    const address = useRef()
    const city = useRef()
    const state = useRef()
    const zip = useRef()
    const phone = useRef()
    const avatar = useRef()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/customers?email=${email.current.value}`)
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

        if (password.current.value === verifyPassword.current.value) {
            existingUserCheck()
                .then(() => {
                    fetch("http://localhost:8088/customers", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            password: password.current.value,
                            firstName: firstName.current.value,
                            lastName: lastName.current.value,
                            phone: phone.current.value,
                            address: address.current.value + ", " + city.current.value + ", " + state.current.value + ", " + zip.current.value,
                            image: avatar.current.value
                        })
                    })
                        .then(_ => _.json())
                        .then(createdUser => {
                            if (createdUser.hasOwnProperty("id")) {
                                localStorage.setItem("villager", createdUser.id)
                                toggle()
                            }
                        })
                })
        } else {
            window.alert("Passwords do not match")
        }
    }

    return (
        <section className="registration__container">
            <Form onSubmit={handleRegister}>
                <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control ref={email} type="email" placeholder="Enter email" />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password *</Form.Label>
                        <Form.Control ref={password} type="password" placeholder="Password" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridVerifyPassword">
                        <Form.Label>Verify Password *</Form.Label>
                        <Form.Control ref={verifyPassword} type="password" placeholder="Verify Password" />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridFirstName">
                        <Form.Label>First Name *</Form.Label>
                        <Form.Control ref={firstName} placeholder="Enter First Name" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridLastName">
                        <Form.Label>Last Name *</Form.Label>
                        <Form.Control ref={lastName} placeholder="Enter Last Name" />
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Address</Form.Label>
                    <Form.Control ref={address} placeholder="1234 Main St" />
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control ref={city} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>State</Form.Label>
                        <Form.Control ref={state} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Zip</Form.Label>
                        <Form.Control ref={zip} />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridAvatar">
                        <Form.Label>Avatar</Form.Label>
                        <Form.Control ref={avatar} placeholder="Enter Image Link" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control ref={phone} />
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