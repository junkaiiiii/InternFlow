import { Router } from "express";
import { validate } from "../services/middleware/validate.js";
import { authMiddleware } from "../services/middleware/auth.js";
import EventService from "../services/event.service.js";
import { EventSchema } from "../libs/validator.js";

const router = Router();


router.use("/", authMiddleware)
router.get('/allEvents', EventService.getEvents)
router.post('/', validate(EventSchema.createEventSchema), EventService.createEvent)
router.put('/:id', validate(EventSchema.idParamSchema, "params"), validate(EventSchema.idParamSchema, "params"), EventService.updateEvent)
router.delete('/:id', validate(EventSchema.idParamSchema, "params"), EventService.deleteEvent)


export default router;
