import { Router } from "express";
import userRouter from "./user.js";
import boardRouter from "./board.js"
import eventRouter from "./event.js"



const router = Router();

router.use("/user", userRouter);
router.use("/board", boardRouter)
router.use("/event", eventRouter)

export default router;