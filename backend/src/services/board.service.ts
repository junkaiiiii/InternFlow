import type { TBoard, TColumn, TApplication, TBoardDetailed } from "../types/types.js"
import prisma from "../libs/prisma.js";
import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../libs/response.js";
import { parseId } from "../libs/parse.js";

class BoardService {
    public static DEFAULT_COLUMNS = [
        { name: "Wishlist", order: 0, color: "#6366f1" },
        { name: "Applied", order: 1, color: "#3b82f6" },
        { name: "Assessment", order: 2, color: "#f59e0b" },
        { name: "Interview", order: 3, color: "#8b5cf6" },
        { name: "Offer", order: 4, color: "#10b981" },
        { name: "Rejected", order: 5, color: "#ef4444" },
    ];

    // this function should be only used after creating a user, never called on a port
    public static initBoard = async (userId: number) => {
        try {
            const board: TBoard = await prisma.board.create({
                data: {
                    userId,
                    columns: { create: this.DEFAULT_COLUMNS }
                }
            })
            return board

        } catch {
            return null
        }
    }

    public static fetchBoardByUserId = async (req: Request, res: Response) => {
        try {
            // or use req.user!.id ?? then only can fetch user own board. hmmm
            
            const userId = req.user!.id
            const boardData = await prisma.board.findUniqueOrThrow({
                where: { userId },
                include: {
                    columns: {
                        orderBy: { order: "asc" },
                        include: {
                            applications: {
                                orderBy: { order: "asc" },
                            },
                        },
                    },
                },
            });

            const board: TBoardDetailed = {
                ...boardData,
                columns: boardData.columns.map(column => ({
                    ...column,
                    applications: column.applications.map(application => ({
                        ...application,
                    })),
                })),
            };
            sendSuccess(res, { board })
        } catch {
            sendError(res, "Error when fetching board")
        }
    }

    public static createApplication = async (req: Request, res: Response) => {
        try {
            const { order, columnId, company, role, priority, appliedAt } = req.body
            // num, num, str, str, prisma priority, datetime OR string ?? note sure datetime can send from frontend onot, will know :>

            const application = await prisma.application.create({
                data: {
                    order, columnId, company, role, priority, appliedAt, createdAt: new Date()
                }
            })

            sendSuccess(res, { application })
        } catch {
            sendError(res, "Error when creating application")
        }
    }

    public static reoderCards = async (req: Request, res: Response) => {
        // get data first
        const { fromCol, toCol, cardId, newIndex }: { fromCol: number, toCol: number, cardId: number, newIndex: number } = req.body;
        const userId = req.user!.id;

        try {
            // verify board is belong to user onot
            const card: TApplication & { column: TColumn & { board: TBoard } } = await prisma.application.findUniqueOrThrow({
                where: {
                    id: cardId
                },
                include: {
                    column: { include: { board: true } }
                }
            })

            if (card.column.board.userId !== userId) {
                sendError(res, "Unauthorized request to update cards")
            }

            // update fromCol then toCol (to Col can use splice(newIndex,0,card ) to insert )
            // use transaction cuz got many queries (all or fail)
            await prisma.$transaction(async (tx) => {
                //  move card to new column
                await tx.application.update({
                    where: { id: cardId },
                    data: { columnId: toCol },
                });

                // get fromCol Cards
                const fromCards = await tx.application.findMany({
                    where: { columnId: fromCol, id: { not: cardId } },
                    orderBy: { order: 'asc' }
                })

                // reassign the order
                await Promise.all(
                    fromCards.map((c, i) => 
                        tx.application.update({
                            where: { id: c.id },
                            data: { order: i }
                        })
                    )
                )

                // get toCol Cards except the moved card
                const toCards = await tx.application.findMany({
                    where: { columnId: toCol, id: { not: cardId } },
                    orderBy: { order: 'asc' }
                })

                // insert into the tocards for reassigning order purpose
                toCards.splice(newIndex, 0, { id: cardId } as any)

                await Promise.all(
                    toCards.map((c, i) =>
                        tx.application.update({
                            where: { id: c.id },
                            data: { order: i },
                        })
                    )
                );
            })
            sendSuccess(res, { message: "Card reordered" });
        } catch {
            sendError(res, "Failed to reorder card");
        }
    }
}

// (alias) type TBoard = {
//     id: number;
//     userId: number;
// }
// type TColumn = {
//     id: number;
//     name: string;
//     boardId: number;
//     order: number;
//     color: string | null;
// }
// type TApplication = {
//     id: number;
//     order: number;
//     columnId: number;
//     company: string;
//     role: string;
//     priority: $Enums.ApplicationPriority;
//     appliedAt: Date | null;
//     createdAt: Date;
// }


export default BoardService