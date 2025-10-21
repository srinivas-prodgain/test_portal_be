import { Router } from "express";

import { async_handler } from "../middlewares/async_handler";
import { create_attempt } from "../controllers/attempts/create-attempt";
import { submit_attempt } from "../controllers/attempts/submit-attempt";
import { register_event } from "../controllers/attempts/register-event";

export const attempts_router = Router();

attempts_router.post("/", async_handler(create_attempt));
attempts_router.post("/:attempt_id/submit", async_handler(submit_attempt));
attempts_router.post("/:attempt_id/event", async_handler(register_event));