import React, { useRef } from "react"
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import "./Auth.css"

export const Login = ({ toggle }) => {
    const email = useRef()
    const password = useRef()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${email.current.value}`)
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
                if (exists && exists.password === password.current.value) {
                    localStorage.setItem("villager", exists.id)
                    toggle()
                } else if (exists && exists.password !== password.current.value) {
                    window.alert("Password does not match.")
                } else if (!exists) {
                    window.alert("Combination of email or password does not exist.")
                }
            })
    }
    return (
        <section className="mainContainer__login">
            <div className="login__container">
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="formGridEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control ref={email} type="email" placeholder="Enter email" required />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={password} type="password" placeholder="Password" required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </section>
    )
}