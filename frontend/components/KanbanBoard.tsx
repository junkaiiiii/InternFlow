"use client"

import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react"
import { useState } from "react";
import KanbanCardItem from "./KanbanCardItem";
import { TApplication } from "@/types/types";

const C = [
    { id: 1, name: "Wishlist", color: "#7F77DD" },
    { id: 2, name: "Applied", color: "#378ADD" },
    { id: 3, name: "Assessment", color: "#EF9F27" },
    { id: 4, name: "Interview", color: "#1D9E75" },
    { id: 5, name: "Offer", color: "#639922" },
    { id: 6, name: "Rejected", color: "#E24B4A" },
];


export function KanbanBoard({ initialData }: { initialData: Record<string, TApplication[]> }) {
    const [columns, setColumns] = useState<Record<string, TApplication[]>>(initialData);

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return; // dropped outside

        const fromCol = source.droppableId;
        const toCol = destination.droppableId;

        const fromList = [...columns[fromCol]];
        const toList = fromCol === toCol ? fromList : [...columns[toCol]];

        const [moved] = fromList.splice(source.index, 1);
        toList.splice(destination.index, 0, moved);

        setColumns({
            ...columns,
            [fromCol]: fromList,
            [toCol]: toList,
        });

        // sync to backend
        // api.put("/board/columns/reorder", {
        //     fromCol, toCol,
        //     cardId: moved.id,
        //     newIndex: destination.index,
        // });
    };


    return (
        <div className="min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Application Pipeline</h2>
                    <p className="text-sm text-gray-500">Drag and drop to update status</p>
                </div>
                <button className="flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Application
                </button>
            </div>

            {/* Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex min-w-0 gap-5 overflow-x-auto mt-30">
                    {C.map(col => (
                        <div key={col.id} className="h-full min-w-[300px] bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] border border-gray-500 rounded-lg overflow-hidden">
                            {/* https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css */}
                            <div className="text-center py-3 font-bold border-b border-gray-500 bg-background ">
                                {col.name} ({columns[col.name]?.length ?? 0})
                            </div>
                            <Droppable droppableId={col.name}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="min-h-10 p-2"
                                    >
                                        {columns[col.name]?.map((card, index) => {
                                            console.log("HALO TEST", columns)
                                            return (

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
                                            )
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}
