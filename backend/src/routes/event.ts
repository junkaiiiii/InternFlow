import { Router } from "express";
import { validate } from "../services/middleware/validate.js";
import { authMiddleware } from "../services/middleware/auth.js";
import EventService from "../services/event.service.js";
import { EventSchema } from "../libs/validator.js";

const router = Router();

// router.post("/signup", validate(UserSchema.createUserSchema), UserService.createUser)
// router.post("/login", validate(UserSchema.loginSchema), UserService.login)

// // protected routes
// router.use("/", authMiddleware)

// router.get('/me', UserService.getCurrentUser)     
// router.get("/", UserService.getUsers);
// router.get("/:id", validate(UserSchema.idParamSchema, "params"), UserService.getUserById);
router.use("/", authMiddleware)
router.get('/allEvents', EventService.getEvents)
router.post('/', validate(EventSchema.createEventSchema), EventService.createEvent)
router.put('/:id', validate(EventSchema.idParamSchema, "params"), validate(EventSchema.idParamSchema, "params"), EventService.updateEvent)
router.delete('/:id', validate(EventSchema.idParamSchema, "params"), EventService.deleteEvent)


export default router;
