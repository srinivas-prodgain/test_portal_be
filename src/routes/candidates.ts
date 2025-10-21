import { Router } from "express";

import { async_handler } from "../middlewares/async_handler";
import { create_candidate } from "../controllers/candidates/create-candidates";

export const candidates_router = Router();

candidates_router.post("/", async_handler(create_candidate));
