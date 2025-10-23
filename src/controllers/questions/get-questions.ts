import { Request, Response } from 'express'

import { mg } from '../../models'
import { TApiResponse, TQuestionsData } from '../../types/api'

export const get_questions = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const questions = await mg.Question.find({}).sort({ _id: 1 }).limit(7).lean()

  const formatted_questions = questions.map((question) => ({
    question_id: question._id?.toString() ?? '',
    question: question.question
  }))

  const response: TApiResponse<TQuestionsData> = {
    message: 'Questions retrieved successfully',
    data: {
      questions: formatted_questions
    }
  }

  return res.status(200).json(response)
}
