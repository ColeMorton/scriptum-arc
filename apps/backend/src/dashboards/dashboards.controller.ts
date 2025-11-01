import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { DashboardsService } from './dashboards.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Dashboards')
@ApiBearerAuth()
@Controller('api/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard aggregated business intelligence' })
  async getDashboard(@TenantId() tenantId: string) {
    return this.dashboardsService.getDashboardData(tenantId)
  }
}
