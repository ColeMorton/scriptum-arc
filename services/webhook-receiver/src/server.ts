import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { register } from './services/metrics'
import { errorHandler } from './middleware/error-handler'
import { metricsMiddleware } from './middleware/metrics'
import webhookRoutes from './routes/webhook'
import logger from './services/logger'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(cors())

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Metrics middleware
app.use(metricsMiddleware)

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'webhook-receiver',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Metrics endpoint
app.get('/metrics', async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType)
  const metrics = await register.metrics()
  res.end(metrics)
})

// API routes
app.use('/webhook', webhookRoutes)

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Webhook receiver started`, {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
  })
})

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received, starting graceful shutdown`)

  server.close(async () => {
    logger.info('HTTP server closed')

    // Close queue connections handled in queue.ts

    process.exit(0)
  })

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Graceful shutdown timeout, forcing exit')
    process.exit(1)
  }, 30000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack,
  })
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', {
    reason,
    promise,
  })
  process.exit(1)
})

export default app
