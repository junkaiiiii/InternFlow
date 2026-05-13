"use client"

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, Search, X, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo, useRef, useCallback } from "react";
import KanbanCardItem from "./KanbanCardItem";
import { TColumnDetailed, TApplication, TApplicationCreation, TApiResponse, TApplicationUpdate } from "@/types/types";
import { api } from "@/libs/api";
import CreateApplicationPopUp from "./CreateApplicationPopUp";
import { BoardValidator } from "@/libs/validators/index";
import UpdateApplicationPopUp from "./UpdateApplicationPopUp";


export function KanbanBoard({ initialData }: { initialData: TColumnDetailed[] }) {
    const [columns, setColumns] = useState<TColumnDetailed[]>(initialData);
    const [creationPopUpShowing, setCreationPopUpShowing] = useState<boolean>(false)
    const [newApplicationPosition, setNewApplicationPosition] = useState<{ columnId: number; order: number; }>()
    const [updatePopUpShowing, setUpdatePopUpShowing] = useState<boolean>(false)
    const [selectedApplication, setSelectedApplication] = useState<TApplicationUpdate>()
    const [searchQuery, setSearchQuery] = useState("")
    const [matchIndex, setMatchIndex] = useState(0)
    const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map())  // card id → DOM node

    // Collect all matched card IDs across all columns (in board order)
    const matchedCardIds = useMemo(() => {
        if (!searchQuery.trim()) return []
        const query = searchQuery.toLowerCase()
        const ids: number[] = []
        columns.forEach(col =>
            col.applications.forEach(app => {
                if (
                    app.company?.toLowerCase().includes(query) ||
                    app.role?.toLowerCase().includes(query) ||
                    app.skills?.some(skill => skill.toLowerCase().includes(query))
                ){ ids.push(app.id) }
            })
        )
        return ids
    }, [columns, searchQuery])

    const matchedSet = useMemo(() => new Set(matchedCardIds), [matchedCardIds])

    // Scroll to a specific match index
    const scrollToMatch = useCallback((index: number) => {
        const id = matchedCardIds[index]
        const el = cardRefs.current.get(id)
        el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })
    }, [matchedCardIds])

    const goToNext = () => {
        const next = (matchIndex + 1) % matchedCardIds.length
        setMatchIndex(next)
        scrollToMatch(next)
    }

    const goToPrev = () => {
        const prev = (matchIndex - 1 + matchedCardIds.length) % matchedCardIds.length
        setMatchIndex(prev)
        scrollToMatch(prev)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setMatchIndex(0)
        // Scroll to first match after state updates
        setTimeout(() => scrollToMatch(0), 50)
    }

    const clearSearch = () => {
        setSearchQuery("")
        setMatchIndex(0)
    }

    const handleAddApplication = async (application: TApplicationCreation) => {
        try {
            const error = BoardValidator.createApplication(application)
            if (error) {
                alert(error)
                return
            }

            const res: TApiResponse<{ application: TApplication }> = await api.post('/board/application', application)

            if (!res.success) {
                alert(res.error)
                return
            }

            setColumns(prev => prev.map(col => (
                col.id === application.columnId
                    ? { ...col, applications: [...col.applications, res.data.application] }
                    : col
            )))
            setCreationPopUpShowing(false)
        } catch (error) {
            console.error(error)
            alert("Error when creating new application")
        }
    }

    const handleUpdateApplication = async (application: TApplicationUpdate) => {
        try {
            const error = BoardValidator.updateApplication(application)
            if (error) {
                alert(error)
                return
            }
            console.log(application)

            const {id, ...rest} = application
            const res: TApiResponse<{ application: TApplication }> = await api.put(`/board/application/${application.id}`,rest)
            
            if (!res.success) {
                alert(res.error)
                return
            }

            setColumns(prev => prev.map(col => (
                col.id === application.columnId
                    ? { ...col, applications: col.applications.map(app => app.id === application.id ? res.data.application : app) }
                    : col
            )))
            setUpdatePopUpShowing(false)
        } catch (error) {
            console.error(error)
            alert("Error when creating new application")
        }
    }

    const handleOpenUpdatePopUp = (application: TApplicationUpdate) => {
        setSelectedApplication(application)
        setUpdatePopUpShowing(true)
    }

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return; // dropped in same spot

        const fromColId = parseInt(source.droppableId);
        const toColId = parseInt(destination.droppableId);

        // update UI optimistically before backend responds
        const newColumns = [...columns];
        const fromCol = newColumns.find(c => c.id === fromColId)!;
        const toCol = newColumns.find(c => c.id === toColId)!;

        const [movedCard] = fromCol.applications.splice(source.index, 1);
        toCol.applications.splice(destination.index, 0, movedCard);

        setColumns(newColumns);

        // sync to backend
        api.put("/board/", {
            fromCol: fromColId,
            toCol: toColId,
            cardId: movedCard.id,
            newIndex: destination.index,
        });
    };


    return (
        <div className="min-w-0 space-y-6 mt-10">

            {/* Search bar with match navigator */}
            <div className="flex items-center gap-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-9 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {searchQuery && (
                        <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Match counter + prev/next */}
                {searchQuery && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="min-w-[60px]">
                            {matchedCardIds.length === 0
                                ? "No results"
                                : `${matchIndex + 1} / ${matchedCardIds.length}`}
                        </span>
                        <button onClick={goToPrev} disabled={matchedCardIds.length === 0} className="p-1 rounded hover:bg-accent disabled:opacity-40">
                            <ChevronUp className="h-4 w-4" />
                        </button>
                        <button onClick={goToNext} disabled={matchedCardIds.length === 0} className="p-1 rounded hover:bg-accent disabled:opacity-40">
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Board — unchanged structure, just add ref + highlight ring */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex min-w-0 gap-5 overflow-auto pt-30 pb-30">
                    {columns.map(col => (
                        <div key={col.id} className="h-full min-w-[300px] bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] border border-gray-500 rounded-lg overflow-hidden">
                            {/* https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css */}
                            <div className="text-center py-3 font-bold border-b border-gray-500 bg-background ">
                                {col.name} ({col.applications?.length ?? 0})
                            </div>
                            <Droppable droppableId={String(col.id)}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-10 p-2">
                                        {col.applications?.map((card, index) => {
                                            const isMatch = matchedSet.has(card.id)
                                            const isActive = matchedCardIds[matchIndex] === card.id

                                            return (
                                                <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={(el) => {
                                                                provided.innerRef(el)           // dnd ref
                                                                if (el) cardRefs.current.set(card.id, el)  // search ref
                                                                else cardRefs.current.delete(card.id)
                                                            }}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`rounded-lg transition-all duration-200 ${
                                                                searchQuery && !isMatch
                                                                    ? "opacity-50"           // dim non-matches
                                                                    : ""
                                                            } ${
                                                                isActive
                                                                    ? "ring-3 ring-primary ring-offset-2"  // highlight active match
                                                                    : ""
                                                            } `}
                                                        >
                                                            <div onClick={() => handleOpenUpdatePopUp(card)}>
                                                                <KanbanCardItem card={card} color={col.color as string} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <button className="flex w-full h-10 items-center justify-center rounded-md border-dashed border text-sm font-medium text-primary-foreground bg-background/70 hover:bg-background/90 cursor-pointer"
                                onClick={() => {
                                    setNewApplicationPosition({ columnId: col.id, order: col.applications.length + 1 })
                                    setCreationPopUpShowing(prev => !prev)

                                }}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Application
                            </button>
                        </div>
                    ))}
                </div>
            </DragDropContext>

            {/* TODO: handle colId and order better */}
            {(newApplicationPosition?.columnId && newApplicationPosition.order) && (
                <CreateApplicationPopUp
                    isShowing={creationPopUpShowing}
                    columnId={newApplicationPosition!.columnId}
                    order={newApplicationPosition!.order}
                    onClose={() => setCreationPopUpShowing(false)}
                    onSubmit={handleAddApplication}
                />
            )}

            {(selectedApplication && updatePopUpShowing) && (
                <UpdateApplicationPopUp
                    onClose={() => setUpdatePopUpShowing(false)}
                    onSubmit={handleUpdateApplication}
                    application={selectedApplication}
                />
            )}

        </div>
    )
}
