import { Router } from "express";

import { async_handler } from "../middlewares/async_handler";
import { get_questions } from "../controllers/questions/get-questions";

export const questions_router = Router();

questions_router.get("/", async_handler(get_questions));
