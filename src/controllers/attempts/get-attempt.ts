import { Request, Response } from 'express'

import { HydratedDocument } from 'mongoose'
import { z } from 'zod'

import { mg } from '../../models'
import { TAttempt } from '../../models/attempt'
import { throw_error } from '../../utils/throw-error'

const z_get_attempt_query = z.object({
  candidate_id: z.string()
})

export const get_attempt = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { candidate_id } = z_get_attempt_query.parse(req.query)

  const attempt = (await mg.Attempt.findOne({
    candidate_id,
    status: 'running'
  }).sort({ createdAt: -1 })) as HydratedDocument<TAttempt>

  if (!attempt) {
    throw_error('No active attempt found for this candidate', 404)
  }

  const formatted_answers = (attempt.answers || []).map((answer) => ({
    question_id:answer.question_id.toString(),
    answers: answer.answers ?? ''
  }))

  return res.status(200).json({
    attempt_id: attempt._id.toString(),
    start_at: attempt.start_at,
    ends_at: attempt.ends_at,
    status: attempt.status,
    violation_count: attempt.violation_count,
    answers: formatted_answers
  })
}
