import { NextFunction, Request, Response } from 'express'

import { TAppError } from '../utils/throw-error'

export const error_handler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const app_error = err as TAppError
  const status_code = app_error.status ?? 500

  console.error(err)

  res.status(status_code).json({
    message: app_error.message ?? 'Internal server error'
  })
}
