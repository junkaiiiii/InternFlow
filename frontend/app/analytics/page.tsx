'use client'

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar"

export default function Analytics() {
    const [token, setToken] = useState<string | null>(null);
    console.log(token)

    useEffect(() => {
        setToken(localStorage.getItem("intern-flow-token"));
    }, []);
    return (
        <div>
            <Sidebar></Sidebar>
        </div>

    )
}