import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PipelinesService } from './pipelines.service'
import { CreatePipelineJobDto } from './dto/create-pipeline-job.dto'
import { QueryPipelinesDto } from './dto/query-pipelines.dto'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Pipelines')
@ApiBearerAuth()
@Controller('api/pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  @ApiOperation({ summary: 'List pipeline jobs with filtering' })
  async listJobs(@Query() query: QueryPipelinesDto, @TenantId() tenantId: string) {
    return this.pipelinesService.listJobs(tenantId, query)
  }

  @Post()
  @ApiOperation({ summary: 'Trigger a new pipeline job' })
  async createJob(@Body() dto: CreatePipelineJobDto, @TenantId() tenantId: string) {
    return this.pipelinesService.createJob(tenantId, dto)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline job details by ID' })
  async getJob(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.pipelinesService.getJob(tenantId, id)
  }

  @Get(':id/results')
  @ApiOperation({ summary: 'Get pipeline job results' })
  async getJobResults(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.pipelinesService.getJobResults(tenantId, id)
  }
}
