import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ServiceMetricsService } from './service-metrics.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Service Metrics')
@ApiBearerAuth()
@Controller('api/service-metrics')
export class ServiceMetricsController {
  constructor(private readonly serviceMetricsService: ServiceMetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get service quality KPIs and metrics' })
  async getServiceMetrics(@TenantId() tenantId: string) {
    return this.serviceMetricsService.getServiceMetrics(tenantId)
  }
}
