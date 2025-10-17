import { Router, Request, Response } from "express";

import { QuestionModel } from "../models/question";
import { async_handler } from "../middlewares/async_handler";

const get_questions = async (_req: Request, res: Response): Promise<Response> => {
    const questions = await QuestionModel.find({})
        .sort({ _id: 1 })
        .limit(7)
        .lean();

    const formatted_questions = questions.map((question) => ({
        id: question._id?.toString() ?? "",
        question: question.question,
    }));

    return res.status(200).json({
        questions: formatted_questions,
    });
};

export const questions_router = Router();

questions_router.get("/", async_handler(get_questions));
