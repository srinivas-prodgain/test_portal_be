import { Request, Response } from 'express'

import { HydratedDocument } from 'mongoose'
import { z } from 'zod'

import { exam_duration_ms } from '../constants/exam'
import { mg } from '../models'
import { TAttempt } from '../models/attempt'
import { throw_error } from '../utils/throw-error'

const z_event_body = z.object({
  type: z.enum([
    'window-blur',
    'window-focus-change',
    'fullscreen-exit',
    'copy-attempt',
    'paste-attempt',
    'devtools-open'
  ]),
  answers: z
    .array(
      z.object({
        questionID: z.string(),
        answers: z.string().optional().default('')
      })
    )
    .optional()
})

const find_attempt_or_throw = async (
  attempt_id: string
): Promise<HydratedDocument<TAttempt>> => {
  const attempt = await mg.Attempt.findById(attempt_id)

  if (!attempt) {
    throw_error('Attempt not found', 404)
  }

  return attempt as HydratedDocument<TAttempt>
}
