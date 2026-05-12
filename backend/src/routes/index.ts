import { Router } from "express";
import userRouter from "./user.js";
import boardRouter from "./board.js"



const router = Router();

router.use("/user", userRouter);
router.use("/board", boardRouter)

export default router;