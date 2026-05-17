import { Router } from "express";
import { authMiddleware } from "../services/middleware/auth.js";
import DashboardService from "../services/dashboard.service.js";

const router = Router();

router.use("/", authMiddleware)
router.get('/', DashboardService.getAnalytics)
router.get('/ai', DashboardService.getAISummary)

export default router;
