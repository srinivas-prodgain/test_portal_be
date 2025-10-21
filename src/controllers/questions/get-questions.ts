import { Request, Response } from "express";

import { mg } from "../../models";

export const get_questions = async (_req: Request, res: Response): Promise<Response> => {
  const questions = await mg.Question.find({})
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
