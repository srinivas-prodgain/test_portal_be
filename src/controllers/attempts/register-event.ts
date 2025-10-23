import { Request, Response } from 'express'

import { HydratedDocument } from 'mongoose'
import { z } from 'zod'

import { mg } from '../../models'
import { TAttempt } from '../../models/attempt'
import { throw_error } from '../../utils/throw-error'
import { TApiResponse, TRegisterEventData } from '../../types/api'
import { MAX_WARNINGS_ALLOWED } from '../../constants/exam'

const z_attempt_id_params = z.object({
  attempt_id: z.string()
})

const z_event_body = z.object({
  type: z.enum([
    'window-blur',
    'window-focus-change',
    'devtools-open',
    'fullscreen'
  ]),
  answers: z
    .array(
      z.object({
        question_id: z.string(),
        answers: z.string().optional().default('')
      })
    )
    .optional()
})

export const register_event = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { attempt_id } = z_attempt_id_params.parse(req.params)
  const { type, answers } = z_event_body.parse(req.body)
  const attempt = (await mg.Attempt.findById(
    attempt_id
  )) as HydratedDocument<TAttempt>

  if (!attempt) {
    throw_error('Attempt not found', 404)
  }

  if (attempt.status !== 'running') {
    const response: TApiResponse<TRegisterEventData> = {
      message: 'Event registered',
      data: {
        action: attempt.status,
        violation_count: attempt.violation_count
      }
    }
    return res.status(200).json(response)
  }

  const now = new Date()

  if (now >= attempt.ends_at) {
    attempt.status = 'terminated'
    attempt.duration_sec = Math.floor(
      (now.getTime() - attempt.start_at.getTime()) / 1000
    )
    if (answers && answers.length > 0) {
      attempt.answers = answers.map((answer) => ({
        question_id: answer.question_id,
        answers: answer.answers ?? ''
      }))
    }
    await attempt.save()

    const response: TApiResponse<TRegisterEventData> = {
      message: 'Event registered - attempt terminated',
      data: {
        action: 'terminate',
        violation_count: attempt.violation_count
      }
    }
    return res.status(200).json(response)
  }

  // Record violation with type and timestamp
  attempt.violation_count += 1
  attempt.violations.push({
    type,
    timestamp: now
  })

  // Save answers if provided (for both warning and termination)
  if (answers && answers.length > 0) {
    attempt.answers = answers.map((answer) => ({
      question_id: answer.question_id,
      answers: answer.answers ?? ''
    }))
  }

  if (attempt.violation_count <= MAX_WARNINGS_ALLOWED) {
    await attempt.save()

    const response: TApiResponse<TRegisterEventData> = {
      message: `Event registered - warning ${attempt.violation_count} of ${MAX_WARNINGS_ALLOWED} issued`,
      data: {
        action: 'warn',
        violation_count: attempt.violation_count
      }
    }
    return res.status(200).json(response)
  }

  attempt.status = 'terminated'
  attempt.duration_sec = Math.floor(
    (now.getTime() - attempt.start_at.getTime()) / 1000
  )
  await attempt.save()

  const response: TApiResponse<TRegisterEventData> = {
    message: 'Event registered - attempt terminated',
    data: {
      action: 'terminate',
      violation_count: attempt.violation_count
    }
  }
  return res.status(200).json(response)
}
