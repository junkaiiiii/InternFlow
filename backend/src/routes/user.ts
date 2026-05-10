import { Router } from "express";
import UserService from "../services/user.service.js";
import { UserSchema } from "../libs/validator.js"
import { validate } from "../services/middleware/validate.js";

const router = Router();

// Define your routes here
router.get("/", UserService.getUsers);
router.get("/:id", validate(UserSchema.idParamSchema, "params"), UserService.getUserById);
router.post("/", validate(UserSchema.createUserSchema), UserService.createUser)


export default router;
