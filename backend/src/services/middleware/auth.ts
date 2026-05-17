import type { Response, Request, NextFunction } from "express"
import { sendSuccess, sendError } from "../../libs/response.js";
import { verifyToken } from "../../libs/jwt.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    // client sends:  Authorization: Bearer <token>
    if (!header?.startsWith("Bearer ")) {
        return sendError(res, "Unauthorized", 401);
    }

    const token = header.split(" ")[1];

    if (!token) return sendError(res, "Invalid or expired token", 401)

    
    try {
        const payload = verifyToken(token);
        
        const { id, ...rest } = payload;
        req.user = { id: parseInt(id, 10), ...rest }; // attach user to request
        // sendSuccess(res, {hi:token})
        next()
    } catch {
        return sendError(res, "Invalid or expired token", 401);
    }
}