import type { Request, Response } from "express"
import { sendError, sendSuccess } from "../libs/response.js"
import prisma from "../libs/prisma.js"
import type { TEvent, TEventReturn, TEventWithApplication } from "../types/types.js"
import { parseId } from "../libs/parse.js"
class EventService {
    public static createEvents = async (req: Request, res: Response) => {
        try {

            const { title, start, duration, applicationId }: Omit<TEvent, "id"> = req.body
            console.log("=== BACKEND RECEIVED ===")
            console.log("raw body.start:", start)
            console.log("parsed:", new Date(start))
            console.log("toISOString:", new Date(start).toISOString())


            const e = await prisma.event.create({
                data: {
                    title, start, duration, applicationId
                },
                include: { application: true }
            })

            const startDate = new Date(start)
            const endDate = new Date(startDate.getTime() + duration * 60 * 1000)

            sendSuccess(res, {
                event: {
                    id: e.id,
                    start: startDate,
                    end: endDate,
                    title: `${e.title} (${e.application.company}-${e.application.role})`,
                    applicationId: e.applicationId
                }
            })
        } catch {
            sendError(res, `Error when creating event title`)
        }
    }

    public static getEvents = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id

            // im stupid rn, i have no idea how to return this using prisma function now
            // const events = await prisma.$queryRaw`
            // SELECT a.events 
            // FROM Application a
            // INNER JOIN Column c ON a.columnId = c.id
            // INNER JOIN Board b ON c.boardId = b.id AND b.userId = ${userId}
            // `
            // nvm 
            const events: TEventWithApplication[] = await prisma.event.findMany({
                where: {
                    application: {
                        column: {
                            board: {
                                userId: userId
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    start: true,
                    duration: true,
                    title: true,
                    applicationId: true,
                    application: {
                        select: {
                            company: true,
                            role: true
                        }
                    }
                }
            })

            // convert duration to end
            const cleanedEvents: TEventReturn[] = events.map(e => {
                const startDate = new Date(e.start)
                const endDate = new Date(startDate.getTime() + e.duration * 60 * 1000)
                return {
                    id: e.id,
                    start: startDate,
                    end: endDate,
                    title: `${e.title} (${e.application.company}-${e.application.role})`,
                    applicationId: e.applicationId
                }
            })

            sendSuccess(res, { events: cleanedEvents })

        } catch {
            sendError(res, "Error when fetching events")
        }
    }
    public static deleteEvent = async (req: Request, res: Response) => {
        const id = parseId(req.params.id)// Event ID from request parameters

        try {
            await prisma.event.delete({
                where: { id },
            });

            sendSuccess(res, { message: "Event deleted successfully" });
        } catch (error) {
            console.error("Error deleting event:", error);
            sendError(res, "Error deleting event");
        }
    };

    // Update Event
    public static updateEvent = async (req: Request, res: Response) => {
        const id = parseId(req.params.id) // Event ID from request parameters
        const { start, duration, title } = req.body; // Updated fields from request body

        try {
            // Update the event by ID
            const updatedEvent: TEvent = await prisma.event.update({
                where: { id }, // Ensure ID is parsed as an integer
                data: {
                    ...(start && { start }), // Ensure start is a valid Date object
                    ...(duration && { duration }), // Ensure duration is an integer
                    ...(title && { title })
                },
            });

            sendSuccess(res, { event: updatedEvent });
        } catch (error) {
            console.error("Error updating event:", error);
            sendError(res, "Error updating event");
        }
    };
}

export default EventService