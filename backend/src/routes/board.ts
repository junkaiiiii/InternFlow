import { Router } from "express";
import { BoardSchema } from "../libs/validator.js";
import BoardService from "../services/board.service.js";
import { validate } from "../services/middleware/validate.js";
import { authMiddleware } from "../services/middleware/auth.js";

const router = Router();

// router.post("/signup", validate(UserSchema.createUserSchema), UserService.createUser)
// router.post("/login", validate(UserSchema.loginSchema), UserService.login)

// // protected routes
// router.use("/", authMiddleware)

// router.get('/me', UserService.getCurrentUser)     
// router.get("/", UserService.getUsers);
// router.get("/:id", validate(UserSchema.idParamSchema, "params"), UserService.getUserById);

router.use('/', authMiddleware)

router.get("/", BoardService.fetchBoardByUserId)
router.post("/", validate(BoardSchema.createApplicationSchema), BoardService.createApplication)
router.put("/", validate(BoardSchema.reorderCardsSchema), BoardService.reoderCards)

export default router;
