import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { logger } from './logger'

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

export async function enqueueJob(jobType: string, payload: unknown): Promise<string> {
  if (!QUEUE_URL) {
    throw new Error('SQS_QUEUE_URL not configured')
  }

  const messageBody = JSON.stringify({
    jobType,
    payload,
    enqueuedAt: new Date().toISOString(),
  })

  const command = new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: messageBody,
    MessageAttributes: {
      jobType: {
        DataType: 'String',
        StringValue: jobType,
      },
    },
  })

  try {
    const response = await sqsClient.send(command)
    logger.info('Job enqueued to SQS', {
      messageId: response.MessageId,
      jobType,
      queueUrl: QUEUE_URL,
    })

    return response.MessageId!
  } catch (error) {
    logger.error('Failed to enqueue job to SQS', {
      error,
      jobType,
      queueUrl: QUEUE_URL,
    })
    throw error
  }
}
