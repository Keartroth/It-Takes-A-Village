import React, { useContext } from "react"
import { QuotesContext } from "../providers/QuotesProvider"
import "./Home.css"

export const Home = () => {
    const { quotes } = useContext(QuotesContext)
    const randomIndexGenerator = () => {
        return Math.floor(Math.random() * 10);
    }
    const randomIndex = randomIndexGenerator() || 1
    const quoteObject = quotes[randomIndex] || {}

    return (
        <div className="mainContainer__home">
            <div className="home__imgContainer">
                <div className="home__textContainer">
                    <h1 className="home--logo bold">It Takes a Village</h1>
                    <h3 className="home--quote">"{quoteObject.quote}"</h3>
                    <h5 className="home--quoteAuthor">-{quoteObject.author}</h5>
                </div>
            </div>
        </div>
    )
}