import bcrypt from "bcrypt";
import prisma from "../libs/prisma.js";
import { Prisma } from "@prisma/client";
import { type Request, type Response } from "express";
import { sendSuccess, sendError } from "../libs/response.js";
import { parseId } from "../libs/parse.js";
import { signToken } from "../libs/jwt.js";
import type { TCreateUser, TUser, TPublicUser, TUpdateUser, TBoard } from "../types/types.js";
import BoardService from "./board.service.js";

class UserService {
    public static getUsers = async (req: Request, res: Response) => {
        const users: TPublicUser[] = await prisma.user.findMany({ select: { username: true, id: true, email: true, registered_at: true } })
        sendSuccess(res, { users }, 200)
    }

    public static getUserById = async (req: Request, res: Response) => {
        const id = parseId(req.params.id);
        try {
            const user: TPublicUser = await prisma.user.findUniqueOrThrow({
                where: { id },
                select: { username: true, id: true, email: true, registered_at: true }
            });
            sendSuccess(res, user)
        } catch (error) {
            sendError(res, `Error When Getting User By Id ${id}`)
        }
    }

    public static getCurrentUser = async (req: Request, res: Response) => {
        const id = req.user!.id
        try {
            const user: TPublicUser = await prisma.user.findUniqueOrThrow({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    registered_at: true
                }
            })
            sendSuccess(res, { user })

        } catch {
            sendError(res, "Error When Getting Current User")
        }
    }

    public static createUser = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
      
        try {
          const passwordHash = await bcrypt.hash(password, 10);
      
          // single transaction — user + board together or not at all
          const { user, board } = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
              data: { username, password: passwordHash, email, registered_at: new Date() },
              omit: { password: true },
            });
      
            const board = await tx.board.create({
              data: {
                userId: user.id,
                columns: {
                  create: BoardService.DEFAULT_COLUMNS,
                },
              },
              include: { columns: true },
            });
      
            return { user, board };
          });
      
          const token = signToken({ id: user.id, username: user.username });
          sendSuccess(res, { token, user, board }, 201);
      
        } catch (error) {
          // handle duplicate username/email from prisma
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              return sendError(res, "Username or email already taken", 409);
            }
          }
          sendError(res, "Could not create account");
        }
      };


    public static login = async (req: Request, res: Response) => {
        const { username, password } = req.body

        try {
            const result: TUser = await prisma.user.findUniqueOrThrow({
                where: {
                    username
                }
            })

            if (!result) return sendError(res, "Invalid credentials", 401)

            const check = await bcrypt.compare(password, result.password)

            if (!check) return sendError(res, "Invalid credentials", 401)

            // verify token instead??
            const token = signToken({ id: result.id, username: result.username });

            sendSuccess(res, { token })
        } catch (error) {
            sendError(res, "Login Failed")
        }
    }

    public static updateUser = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        const id = parseId(req.params.id);

        try {
            const user: TPublicUser = await prisma.user.update({
                where: { id },
                data: {
                    ...(username && { username }),
                    ...(password && { password }),
                    ...(email && { email }),
                },
                omit: { password: true }
            });

            sendSuccess(res, { user });
        } catch {
            sendError(res, "User not found", 404);
        }
    };
}

export default UserService;
