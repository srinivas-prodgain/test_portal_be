import { Request, Response } from 'express'

import { HydratedDocument } from 'mongoose'
import { z } from 'zod'

import { mg } from '../../models'
import { TAttempt } from '../../models/attempt'
import { throw_error } from '../../utils/throw-error'

const z_attempt_id_params = z.object({
  attempt_id: z.string()
})

const z_update_answer_body = z.object({
  question_id: z.string(),
  answers: z.string().optional().default('')
})

export const update_answer = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { attempt_id } = z_attempt_id_params.parse(req.params)
  const { question_id, answers } = z_update_answer_body.parse(req.body)

  const attempt = (await mg.Attempt.findById(
    attempt_id
  )) as HydratedDocument<TAttempt>

  if (!attempt) {
    throw_error('Attempt not found', 404)
  }

  if (attempt.status !== 'running') {
    return res.status(409).json({
      message: 'Attempt is not active'
    })
  }

  // Find existing answer or create new one
  const existing_answer_index = attempt.answers.findIndex(
    (answer) => answer.question_id.toString() === question_id
  )

  if (existing_answer_index >= 0) {
    // Update existing answer
    attempt.answers[existing_answer_index].answers = answers ?? ''
  } else {
    // Add new answer
    attempt.answers.push({
      question_id,
      answers: answers ?? ''
    })
  }

  await attempt.save()

  return res.status(200).json({
    message: 'Answer updated successfully',
    data: {
      question_id,
      answers: answers ?? ''
    }
  })
}
