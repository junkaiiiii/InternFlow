import { Router } from "express";
import userRouter from "./user.js";
import boardRouter from "./board.js"
import eventRouter from "./event.js"
import dashboardRouter from "./dashboard.js"



const router = Router();

router.use("/user", userRouter);
router.use("/board", boardRouter)
router.use("/event", eventRouter)
router.use("/dashboard", dashboardRouter)

export default router;