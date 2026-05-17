import { Router } from "express";
import { authMiddleware } from "../services/middleware/auth.js";
import DocumentService from "../services/document.service.js";
import multer from "multer"

const upload = multer({
    storage: multer.memoryStorage()
})

const router = Router();

router.use("/", authMiddleware)
router.post('/', upload.single("file"), DocumentService.createDocument)

export default router;
