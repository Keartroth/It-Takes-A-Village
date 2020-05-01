import React, { useState } from "react"
import Dashboard from "./Dashboard"
import "./ItTakesAVillage.css"
import { Auth } from "./auth/Auth"


export const ItTakesAVillage = () => {
    const [check, update] = useState(false)
    const toggle = () => update(!check)

    return (
        localStorage.getItem("villager") ? <Dashboard toggle={toggle} /> : <Auth toggle={toggle} />
)}