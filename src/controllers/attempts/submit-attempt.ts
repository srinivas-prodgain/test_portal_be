import { Request, Response } from 'express'

import { HydratedDocument } from 'mongoose'
import z from 'zod'

import { mg } from '../../models'
import { TAttempt, TAttemptStatus } from '../../models/attempt'
import { throw_error } from '../../utils/throw-error'

const z_attempt_id_params = z.object({
  attempt_id: z.string()
})

const z_submit_attempt_body = z.object({
  answers: z
    .array(
      z.object({
        question_id: z.string(),
        answers: z.string().optional().default('')
      })
    )
    .optional(),
  is_auto_submit: z.boolean().optional().default(false)
})

export const submit_attempt = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { attempt_id } = z_attempt_id_params.parse(req.params)
  const { answers, is_auto_submit } = z_submit_attempt_body.parse(req.body)
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

  const now = new Date()
  const is_time_expired = now >= attempt.ends_at

  let final_status: TAttemptStatus
  if (is_auto_submit && is_time_expired) {
    final_status = 'auto_submitted'
  } else if (is_time_expired) {
    final_status = 'terminated'
  } else {
    final_status = 'submitted'
  }

  // Only update answers if provided (for backward compatibility)
  if (answers && answers.length > 0) {
    attempt.answers = answers.map((answer) => ({
      question_id: answer.question_id,
      answers: answer.answers ?? ''
    }))
  }
  attempt.status = final_status
  attempt.duration_sec = Math.floor(
    (now.getTime() - attempt.start_at.getTime()) / 1000
  )
  await attempt.save()

  return res.status(204).send()
}
