import { Router } from "express";
import { authMiddleware } from "../services/middleware/auth.js";
import DocumentService from "../services/document.service.js";
import multer from "multer"
import prisma from "../libs/prisma.js";

const upload = multer({
    storage: multer.memoryStorage()
})

const router = Router();

router.get("/debug/pdf", async (req, res) => {
    const doc = await prisma.document.findFirst()

    console.log(doc?.file)

    res.send({
        isBuffer: Buffer.isBuffer(doc?.file),
        length: doc?.file?.length
    })
})
router.use("/", authMiddleware)
router.post('/', upload.single("file"), DocumentService.createDocument)

export default router;
