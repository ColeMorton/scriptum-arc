import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { logger } from './logger'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.AWS_ENDPOINT_URL || undefined,
  forcePathStyle: true, // Required for LocalStack
  credentials: process.env.AWS_ENDPOINT_URL
    ? {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      }
    : undefined,
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME

export async function storeResults(
  jobId: string,
  sweepRunId: string,
  results: Record<string, unknown>[]
): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME not configured')
  }

  const key = `results/${jobId}/${sweepRunId}.json`
  const body = JSON.stringify(results, null, 2)

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: 'application/json',
    Metadata: {
      jobId,
      sweepRunId,
      resultCount: String(results.length),
      storedAt: new Date().toISOString(),
    },
  })

  try {
    await s3Client.send(command)

    logger.info('Results stored in S3', {
      bucket: BUCKET_NAME,
      key,
      resultCount: results.length,
    })

    return key
  } catch (error) {
    logger.error('Failed to store results in S3', {
      error,
      bucket: BUCKET_NAME,
      key,
    })
    throw error
  }
}
