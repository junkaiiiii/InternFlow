import { useEffect, useState } from "react"
import type { TAnalyticsResponse, TApiResponse } from "@/types/types"
import { api } from "@/libs/api"

interface UseAnalyticsResult {
  data: TAnalyticsResponse | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function useAnalytics(): UseAnalyticsResult {
  const [data, setData] = useState<TAnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchAnalytics() {
      setIsLoading(true)
      setError(null)
      try {
        const res: TApiResponse<TAnalyticsResponse> = await api.get("/dashboard/")
        console.log("debug", res)
        if (!res.success) throw new Error(`Request failed: ${res.error}`)

        if (!cancelled) setData(res.data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchAnalytics()
    return () => { cancelled = true }
  }, [tick])

  return { data, isLoading, error, refetch: () => setTick(t => t + 1) }
}