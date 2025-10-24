import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs'
import { processTradingSweep } from './processors/trading-sweep-processor'
import { logger } from './services/logger'

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL || undefined,
  credentials: process.env.AWS_ENDPOINT_URL
    ? {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      }
    : undefined,
})

const QUEUE_URL = process.env.SQS_QUEUE_URL
const POLL_INTERVAL = 1000 // 1 second between polls

export async function startWorker() {
  logger.info('Starting SQS worker', { queueUrl: QUEUE_URL })

  if (!QUEUE_URL) {
    throw new Error('SQS_QUEUE_URL not configured')
  }

  while (true) {
    try {
      const messages = await receiveMessages()

      for (const message of messages) {
        await processMessage(message)
      }

      if (messages.length === 0) {
        await sleep(POLL_INTERVAL)
      }
    } catch (error) {
      logger.error('Worker error', { error })
      await sleep(5000) // Backoff on error
    }
  }
}

async function receiveMessages(): Promise<Message[]> {
  const command = new ReceiveMessageCommand({
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20, // Long polling
    VisibilityTimeout: 3600, // 1 hour
    MessageAttributeNames: ['All'],
  })

  const response = await sqsClient.send(command)
  return response.Messages || []
}

async function processMessage(message: Message) {
  try {
    const body = JSON.parse(message.Body!)
    const { jobType, payload } = body

    logger.info('Processing message', {
      messageId: message.MessageId,
      jobType,
    })

    if (jobType === 'trading-sweep') {
      await processTradingSweep(payload)
    } else {
      logger.warn('Unknown job type', { jobType })
    }

    // Delete message on success
    await deleteMessage(message.ReceiptHandle!)
  } catch (error) {
    logger.error('Message processing failed', {
      error,
      messageId: message.MessageId,
    })
    // Message will become visible again after visibility timeout
  }
}

async function deleteMessage(receiptHandle: string) {
  const command = new DeleteMessageCommand({
    QueueUrl: QUEUE_URL,
    ReceiptHandle: receiptHandle,
  })
  await sqsClient.send(command)
  logger.info('Message deleted from queue')
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
