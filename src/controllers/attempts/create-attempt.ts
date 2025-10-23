import { Request, Response } from 'express'

import { z } from 'zod'

import { exam_duration_ms } from '../../constants/exam'
import { mg } from '../../models'
import { TApiResponse, TAttemptData } from '../../types/api'

const z_create_attempt_body = z.object({
  candidate_id: z.string()
})

export const create_attempt = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { candidate_id } = z_create_attempt_body.parse(req.body)
  const start_at = new Date()
  const ends_at = new Date(start_at.getTime() + exam_duration_ms)

  const attempt = await mg.Attempt.create({
    candidate_id,
    status: 'running',
    duration_sec: 0,
    start_at,
    ends_at,
    violation_count: 0,
    answers: []
  })

  const response: TApiResponse<TAttemptData> = {
    message: 'Attempt created successfully',
    data: {
      attempt_id: attempt._id.toString(),
      start_at: attempt.start_at,
      ends_at: attempt.ends_at
    }
  }

  return res.status(201).json(response)
}
