"use client"

import { Send, BrainCircuit, RefreshCw, AlertCircle } from "lucide-react"
import { useAnalytics } from "@/hooks/useAnalytics"
import { MetricCard } from "@/components/MetricCard"
import { PipelineChart } from "@/components/Pipelinechart"
import { TopSkills } from "@/components/Topskills"
import Sidebar from "@/components/Sidebar"
import useAISummary from "@/hooks/useAISummary"
import type { TAISummary } from "@/types/types"

export default function DashboardPage() {
    const { data, isLoading, error, refetch } = useAnalytics()
    const summary = useAISummary()

    const totalApps = data?.pipelineData.reduce((s, c) => s + c.count, 0) ?? 0

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm">{error}</p>
                <button
                    onClick={refetch}
                    className="flex items-center gap-2 text-sm border rounded-md px-3 py-1.5 hover:bg-muted transition-colors active:scale-[0.98]"
                >
                    <RefreshCw className="h-4 w-4" /> Retry
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            {/* Header */}


            <main className="min-w-0 px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8 flex flex-col gap-10">
                <div>
                    <div className="mb-2">
                        <h1 className="text-xl font-bold">Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Your job search at a glance</p>
                    </div>
                    <button
                        onClick={refetch}
                        className="bg-primary flex items-center gap-2 text-sm border rounded-md px-3 py-1.5 hover:bg-primary/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>


                {/* Metric cards */}
                <div className="flex justify-between">
                    <div className="w-[20%] border-white border rounded-xl mr-5">
                    <MetricCard
                        label="Total applied"
                        value={isLoading ? "—" : totalApps}
                        icon={<Send className="h-4 w-4" />}
                    />
                    </div>
                    

                    <div className="w-[80%] border-white border rounded-xl p-3">
                        <div className="text-md font-bold mb-1 flex space-x-3">
                            <BrainCircuit />
                            <p>AI Analytics</p>
                        </div>
                        {!summary ? "Generating AI Summary": summary}
                    </div>
                </div>


                {/* Pipeline + Skills side by side */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {isLoading ? (
                        <>
                            <div className="rounded-xl border bg-card p-5 h-[320px] animate-pulse" />
                            <div className="rounded-xl border bg-card p-5 h-[320px] animate-pulse" />
                        </>
                    ) : (
                        <>
                            {data?.pipelineData.length ? <PipelineChart data={data.pipelineData} /> : null}
                            {data?.topSkills.length ? <TopSkills data={data.topSkills} /> : null}
                        </>
                    )}
                </div>
            </main >
        </div>
    )
}