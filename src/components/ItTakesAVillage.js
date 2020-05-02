import React, { useState } from "react"
import { Auth } from "./auth/Auth"
import { Dashboard } from "./Dashboard"
import { VillageUsersProvider } from "./providers/VillageUsersProvider"
import "./ItTakesAVillage.css"


export const ItTakesAVillage = () => {
    const [check, update] = useState(false)
    const toggle = () => update(!check)

    return (
        localStorage.getItem("villager") ?
            <VillageUsersProvider>
                <Dashboard toggle={toggle} />
            </VillageUsersProvider>
            : <Auth toggle={toggle} />
    )
}