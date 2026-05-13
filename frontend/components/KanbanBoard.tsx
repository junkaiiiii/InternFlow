"use client"

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react"
import { useState } from "react";
import KanbanCardItem from "./KanbanCardItem";
import { TColumnDetailed, TApplication, TApplicationCreation, TApiResponse } from "@/types/types";
import { api } from "@/libs/api";
import CreateApplicationPopUp from "./CreateApplicationPopUp";
import { BoardValidator } from "@/libs/validators/index";


export function KanbanBoard({ initialData }: { initialData: TColumnDetailed[] }) {
    const [columns, setColumns] = useState<TColumnDetailed[]>(initialData);
    const [creationPopUpShowing, setCreationPopUpShowing] = useState<boolean>(false)
    const [newApplicationPosition, setNewApplicationPosition] = useState<{ columnId: number; order: number; }>()
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
        <div className="min-w-0 space-y-6">
            {/* Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex min-w-0 gap-5 overflow-x-auto mt-30">
                    {columns.map(col => (
                        <div key={col.id} className="h-full min-w-[300px] bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] border border-gray-500 rounded-lg overflow-hidden">
                            {/* https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css */}
                            <div className="text-center py-3 font-bold border-b border-gray-500 bg-background ">
                                {col.name} ({col.applications?.length ?? 0})
                            </div>
                            <Droppable droppableId={String(col.id)}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="min-h-10 p-2"
                                    >
                                        {col.applications?.map((card, index) => (
                                            <Draggable key={card.id} draggableId={String(card.id)} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <KanbanCardItem
                                                            card={card}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}

                            </Droppable>
                            <button className="flex w-full h-10 items-center justify-center rounded-md border-dashed border text-sm font-medium text-primary-foreground bg-background/70 hover:bg-background/90 cursor-pointer"
                                onClick={() => {
                                    setNewApplicationPosition({ columnId: col.id, order: col.applications.length+1 })
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

        </div>
    )
}
