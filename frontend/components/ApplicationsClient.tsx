'use client'
import Sidebar from "@/components/sidebar"
import { KanbanBoard } from "@/components/KanbanBoard"
import type { TApiResponse, TBoardDetailed, TColumnDetailed } from "@/types/types"
import { api } from "@/libs/api"
import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

export default function ApplicationsClient() {
    const [columns, setColumns] = useState<TColumnDetailed[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBoard = async () => {
            const data: TApiResponse<{ board: TBoardDetailed }> = await api.get('/board/')

            if (!data.success) {
                setError(data.error ?? "Board not found, initializing new board...")
                setIsLoading(true)
                const newBoardData: TApiResponse<{ board: TBoardDetailed }> = await api.post('/board/init', { body: {} })
                console.log("Hi:", newBoardData)

                if (!newBoardData.success) {
                    setError(data.error ?? "Error when initializing board")
                    setIsLoading(false)
                    return
                }
            }

            setColumns(data.data.board.columns)
            setIsLoading(false)
        }

        fetchBoard().catch(() => {
            setError("Error when fetching board")
            setIsLoading(false)
        })
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            {/* Header */}


            <main className="min-w-0 px-4 py-6 sm:px-6 lg:pl-72 lg:pr-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Application Pipeline</h2>
                        <p className="text-sm text-gray-500">Drag and drop to update status</p>
                    </div>
                    
                </div>


                {isLoading && <h1 className="mt-30 text-2xl">Loading board...</h1>}
                {error && <h1 className="mt-30 text-2xl">{error}</h1>}
                {!isLoading && !error && (
                    <KanbanBoard
                        initialData={columns}
                    />
                )}
            </main>
        </div>
    )
}
