import prisma from "../libs/prisma.js";
import { type Request, type Response } from "express";
import { sendSuccess, sendError } from "../libs/response.js";
import { parseId } from "../libs/parse.js";

class UserService {
    public static getUsers = async (req: Request, res: Response) => {
        const users = await prisma.user.findMany()
        sendSuccess(res, { users }, 200)
    }

    public static getUserById = async (req: Request, res: Response) => {
        const id = parseId(req.params.id);
        try {
            const user = await prisma.user.findUniqueOrThrow({
                where: { id },
            });
            sendSuccess(res, user)
        } catch (error) {
            sendError(res, "Error")
        }
    }

    public static createUser = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        try {
            const result = await prisma.user.create({
                data: {
                    username,
                    password,
                    email,
                    registered_at: new Date()
                }
            });
            sendSuccess(res, result);
        } catch (error) {
            sendError(res, "Error");
        }
    }

    public static updateUser = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        const id = parseId(req.params.id);

        try {
            const user = await prisma.user.update({
                where: { id },
                data: {
                    ...(username && { username }),
                    ...(password && { password }),
                    ...(email && { email }),
                },
            });
            sendSuccess(res, { user });
        } catch {
            sendError(res, "User not found", 404);
        }
    };
}

export default UserService;
