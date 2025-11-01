import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator'

export enum JobType {
  TRADING_SWEEP = 'trading-sweep',
  DOCUMENT_PROCESSING = 'document-processing',
  DATA_ETL = 'data-etl',
  ML_INFERENCE = 'ml-inference',
}

export class CreatePipelineJobDto {
  @ApiProperty({
    description: 'Type of job to execute',
    enum: JobType,
  })
  @IsEnum(JobType)
  job_type: JobType

  @ApiPropertyOptional({
    description: 'Stock ticker symbol (for trading-sweep jobs)',
  })
  @IsOptional()
  @IsString()
  ticker?: string

  @ApiPropertyOptional({
    description: 'Additional configuration for the job',
    type: 'object',
  })
  @IsOptional()
  @IsObject()
  config?: Record<string, unknown>
}
