import { Router } from "express";
import UserService from "../services/user.service.js";
import { UserSchema } from "../libs/validator.js"
import { validate } from "../services/middleware/validate.js";
import { authMiddleware } from "../services/middleware/auth.js";

const router = Router();

router.post("/signup", validate(UserSchema.createUserSchema), UserService.createUser)
router.post("/login", validate(UserSchema.loginSchema), UserService.login)

// protected routes
router.use("/", authMiddleware)
router.get("/", UserService.getUsers);
router.get("/:id", validate(UserSchema.idParamSchema, "params"), UserService.getUserById);



export default router;
