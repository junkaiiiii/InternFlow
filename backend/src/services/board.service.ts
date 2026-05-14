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
    public static initBoard = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id
            const board: TBoardDetailed = await prisma.board.create({
                data: {
                    userId,
                    columns: { create: this.DEFAULT_COLUMNS }
                },
                include: {
                    columns: { include: { applications: true } }
                }
            })
            sendSuccess(res, { board })

        } catch {
            sendError(res, "Error when initializing board")
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
            const userId = req.user!.id
            const { order, columnId, company, role, priority, appliedAt, url, skills } = req.body

            const column = await prisma.column.findFirst({
                where: {
                    id: columnId,
                    board: { userId }
                }
            })

            if (!column) {
                sendError(res, "Column not found", 404)
                return
            }

            const applicationCount = await prisma.application.count({
                where: { columnId }
            })

            const application = await prisma.application.create({
                data: {
                    order: Math.min(order, applicationCount),
                    columnId,
                    company,
                    role,
                    priority,
                    appliedAt,
                    url,
                    skills
                }
            })

            sendSuccess(res, { application }, 201)
        } catch (error) {
            console.error(error)
            sendError(res, "Error when creating application")
        }
    }

    public static updateApplication = async (req: Request, res: Response) => {
        try {
            const applicationId = parseId(req.params.id)
            const { company, role, priority, appliedAt, url, skills } = req.body

            const data = {
                ...(company && { company }),
                ...(role && { role }),
                ...(priority && { priority }),
                ...(appliedAt && { appliedAt }),
                ...(url && { url }),
                ...(skills && { skills })
            }



            const application = await prisma.application.update({
                where: {
                    id: applicationId
                },
                data
            })


            sendSuccess(res, { application }, 200)
        } catch (error) {
            console.error(error)
            sendError(res, "Error when creating application")
        }
    }

    public static deleteApplication = async (req: Request, res: Response) => {
        const id = parseId(req.params.id);
        const userId = req.user!.id;

        try {
            // delete and reorder (use transaction)
            await prisma.$transaction(async (tx) => {
                // Find and delete the application
                const application = await tx.application.delete({
                    where: {
                        id,
                    },
                    include: {
                        column: {
                            include: {
                                board: true,
                            },
                        },
                    },
                });

               
                if (application.column.board.userId !== userId) {
                    throw new Error("Unauthorized request to delete application");
                }

                const applications = await tx.application.findMany({
                    where: { columnId: application.columnId },
                    orderBy: { order: "asc" },
                });

                await Promise.all(
                    applications.map((app, index) =>
                        tx.application.update({
                            where: { id: app.id },
                            data: { order: index },
                        })
                    )
                );
            });

            sendSuccess(res, {message: `Successful delete application ${id}`});
        } catch (error) {
            console.error(error);
            sendError(res, "Failed to delete application");
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
