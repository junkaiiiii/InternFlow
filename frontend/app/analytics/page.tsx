'use client'

import { useEffect, useState } from "react";

export default function Analytics() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem("intern-flow-token"));
    }, []);
    return (
        <div>
            <h1>Analytics</h1>
            <h1>{token}</h1>
        </div>

    )
}