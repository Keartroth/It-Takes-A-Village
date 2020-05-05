import React, { useContext, useRef } from "react"
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { UserContext } from "../providers/UsersProvider"
import "./Account.css"

export const Account = props => {
    const { users, updateUser } = useContext(UserContext)
    const userId = props.userId
    const firstName = useRef()
    const lastName = useRef()
    const email = useRef()
    const password = useRef()
    const address = useRef()
    const city = useRef()
    const state = useRef()
    const zip = useRef()
    const phone = useRef()
    const avatar = useRef()

    const currentUser = users.find(u => u.id === userId) || { address: "" }
    delete currentUser.password

    const [currentStreet, currentCity, currentState, currentZip] = currentUser.address.split(", ")

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${currentUser.email}`)
            .then(_ => _.json())
            .then(user => {
                if (user) {
                    return user[0]
                }
                return false
            })
    }

    const updateAccountInfo = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then((result) => {
                if (result.password === password.current.value) {
                    let updatedUserObject = {
                        email: email.current.value,
                        password: password.current.value,
                        firstName: firstName.current.value,
                        lastName: lastName.current.value,
                        phone: phone.current.value,
                        address: address.current.value + ", " + city.current.value + ", " + state.current.value + ", " + zip.current.value,
                        image: avatar.current.value,
                        id: result.id
                    }
                    updateUser(updatedUserObject)
                } else {
                    window.alert("Password entered does not match password on file.")
                }
            })
    }

    return (
        <>
            <section className="accountContainer">
                <Container>
                    <h1>Your Account</h1>

                    <Form onSubmit={updateAccountInfo}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="email">
                                <Form.Label>Email *</Form.Label>
                                <Form.Control type="email" defaultValue={currentUser.email} ref={email} required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="password">
                                <Form.Label>Password *</Form.Label>
                                <Form.Control type="password" ref={password} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="firstName">
                                <Form.Label>First Name *</Form.Label>
                                <Form.Control defaultValue={currentUser.firstName} ref={firstName} required />
                            </Form.Group>

                            <Form.Group as={Col} controlId="lastName">
                                <Form.Label>Last Name *</Form.Label>
                                <Form.Control defaultValue={currentUser.lastName} ref={lastName} required />
                            </Form.Group>
                        </Form.Row>

                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control defaultValue={currentStreet} ref={address} />
                        </Form.Group>

                        <Form.Row>
                            <Form.Group as={Col} controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control defaultValue={currentCity} ref={city} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="state">
                                <Form.Label>State</Form.Label>
                                <Form.Control defaultValue={currentState} ref={state} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="zip">
                                <Form.Label>Zip</Form.Label>
                                <Form.Control defaultValue={currentZip} ref={zip} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group as={Col} controlId="avatar">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control defaultValue={currentUser.image} ref={avatar} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="number">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control defaultValue={currentUser.phone} ref={phone} />
                            </Form.Group>
                        </Form.Row>

                        <Form.Text className="text-muted">
                            * Required field
                        </Form.Text>
                        <br />

                        <Button variant="primary" type="submit">
                            Update Account Information
                        </Button>
                    </Form>
                </Container>
            </section>
        </>
    )
}