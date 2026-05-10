import type { ZodSchema } from "zod"
import { type Response, type Request, type NextFunction } from "express"
import { sendError } from "../../libs/response.js"

export const validate = (schema: ZodSchema, source: 'body' | 'params' | "query" = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source])
        //         .safeParse return value
        // .safeParse(data:unknown): { success: true; data: T; } | { success: false; error: ZodError; }
        // reference: https://v3.zod.dev/?id=safeparse

        if (!result.success) {
            const message = result.error.message
            sendError(res, message, 400)
            return 
        }

        req[source] = result.data
        next()
    }
}