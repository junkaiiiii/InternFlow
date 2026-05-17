import { Router } from "express";
import userRouter from "./user.js";
import boardRouter from "./board.js"
import eventRouter from "./event.js"
import dashboardRouter from "./dashboard.js"
import documentRouter from "./document.js"



const router = Router();

router.use("/user", userRouter);
router.use("/board", boardRouter)
router.use("/event", eventRouter)
router.use("/dashboard", dashboardRouter)
router.use("/document", documentRouter)

export default router;