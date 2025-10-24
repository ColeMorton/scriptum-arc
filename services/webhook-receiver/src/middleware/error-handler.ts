import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import logger from '../services/logger'
import { ErrorResponse } from '../types'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Zod validation errors
  if (error instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      error: 'Validation failed',
      details: error.errors,
      timestamp: new Date().toISOString(),
    }

    logger.warn('Validation error', {
      path: req.path,
      method: req.method,
      errors: error.errors,
    })

    res.status(400).json(errorResponse)
    return
  }

  // Application errors
  if (error instanceof AppError) {
    const errorResponse: ErrorResponse = {
      error: error.message,
      timestamp: new Date().toISOString(),
    }

    logger.error('Application error', {
      path: req.path,
      method: req.method,
      status: error.statusCode,
      message: error.message,
    })

    res.status(error.statusCode).json(errorResponse)
    return
  }

  // Unknown errors
  logger.error('Unexpected error', {
    path: req.path,
    method: req.method,
    error: error.message,
    stack: error.stack,
  })

  const errorResponse: ErrorResponse = {
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
  }

  res.status(500).json(errorResponse)
}

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
