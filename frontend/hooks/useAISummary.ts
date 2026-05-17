import { useEffect, useState } from "react"
import type { TAISummary } from "@/types/types"
import { api } from "@/libs/api"

export default function useAISummary() {
    const [message, setMessage] = useState<{summary: string}>()

    useEffect(()=>{
        api.get('/dashboard/ai')
            .then((response) => {
                setMessage(response?.data?.message)
            })
            .catch((error) => {
                console.error("Error fetching AI summary:", error);
                setMessage(error);
            });
    },[])

    return message 
}