import prisma from "../libs/prisma.js";
import { sendSuccess, sendError } from "../libs/response.js";
import type { Request, Response } from "express";

class DocumentService {
    public static createDocument = async (req: Request, res: Response) => {

        try {
            const userId = req.user!.id

            if (!req.file) {
                console.error("UPLOAD ERROR")
                sendError(res, "No File is Uploaded")
                return;
            }

            // find existing document
            const existingDocument = await prisma.document.findFirst({
                where: {
                    userId
                }
            })

            // delete old document if exists

            if (existingDocument) {
                await prisma.document.delete({
                    where: {
                        id: existingDocument.id
                    }
                })
            }

            // create new document

            const document = await prisma.document.create({
                data: {
                    userId,
                    filename: req.file.originalname,
                    mimetype: req.file.mimetype,
                    file: req.file.buffer
                }
            })

            return sendSuccess(res, {document})

        } catch (error) {
            console.error("UPLOAD ERROR:", error)
            sendError(res, "Upload Failed")
        }
    }
}

export default DocumentService