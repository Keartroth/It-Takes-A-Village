import React, { useState, useEffect } from "react"

/*
    The context is imported and used by individual components
    that need data
*/
export const FakeTestimonialsContext = React.createContext()

/*
 This component establishes what data can be used.
 */
export const FakeTestimonialsProvider = (props) => {
    const [fakeTestimonials, setFakeTestimonials] = useState([])

    const getFakeTestimonials = () => {
        return fetch("http://localhost:8088/fakeTestimonials")
            .then(res => res.json())
            .then(setFakeTestimonials)
    }

    const addfakeTestimonials = fakeTestimonials => {
        return fetch("http://localhost:8088/fakeTestimonials", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(fakeTestimonials)
        })
            .then(getFakeTestimonials)
    }

    /*
        Load all fakeTestimonials when the component is initialized. Ensure that
        an empty array is the second argument to avoid infinite loop.
    */
    useEffect(() => {
        getFakeTestimonials()
    }, [])

    return (
        <FakeTestimonialsContext.Provider value={{
            fakeTestimonials, addfakeTestimonials
        }}>
            {props.children}
        </FakeTestimonialsContext.Provider>
    )
}