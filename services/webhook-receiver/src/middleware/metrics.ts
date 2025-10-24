import { Request, Response, NextFunction } from 'express'
import { httpRequestDuration, httpRequestsTotal } from '../services/metrics'

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()

  // Capture response finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000 // Convert to seconds
    const route = req.route?.path || req.path
    const statusCode = res.statusCode.toString()

    // Record metrics
    httpRequestDuration.labels(req.method, route, statusCode).observe(duration)

    httpRequestsTotal.labels(req.method, route, statusCode).inc()
  })

  next()
}
