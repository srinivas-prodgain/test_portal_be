import { Request, Response } from 'express'

import { z } from 'zod'

import { mg } from '../../models'
import { throw_error } from '../../utils/throw-error'
import { TApiResponse } from '../../types/api'

type TMongoServerError = Error & {
  code?: number
}

const z_create_candidate_body = z.object({
  email: z.string(),
  linkedin_profile_url: z.string(),
  github_profile_url: z.string(),
  resume: z.string().optional()
})

export const create_candidate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const payload = z_create_candidate_body.parse(req.body)

  try {
    const candidate = await mg.Candidate.create(payload)

    const response: TApiResponse<{ candidate_id: string }> = {
      message: 'Candidate created successfully',
      data: {
        candidate_id: candidate._id.toString()
      }
    }
    return res.status(201).json(response)
  } catch (error) {
    const mongo_error = error as TMongoServerError

    if (mongo_error.code === 11000) {
      throw_error('Candidate already exists', 409)
    }

    throw error
  }
}
