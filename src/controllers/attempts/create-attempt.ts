import { Request, Response } from 'express'

import { z } from 'zod'

import { exam_duration_ms } from '../../constants/exam'
import { mg } from '../../models'

const z_create_attempt_body = z.object({
  candidate_id: z.string()
})

export const create_attempt = async (
  { body }: Request,
  res: Response
): Promise<Response> => {
  const { candidate_id } = z_create_attempt_body.parse(body)
  const start_at = new Date()
  const ends_at = new Date(start_at.getTime() + exam_duration_ms)

  const attempt = await mg.Attempt.create({
    candidate_id,
    status: 'running',
    durationSec: 0,
    startAt: start_at,
    endsAt: ends_at,
    violationCount: 0,
    answers: []
  })

  return res.status(201).json({
    attempt_id: attempt._id.toString(),
    startAt: attempt.startAt,
    endsAt: attempt.endsAt
  })
}
