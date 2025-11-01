import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TimeTrackingService } from './time-tracking.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Time Tracking')
@ApiBearerAuth()
@Controller('api/time-tracking')
export class TimeTrackingController {
  constructor(private readonly timeTrackingService: TimeTrackingService) {}

  @Get()
  @ApiOperation({ summary: 'Get billable hours tracking and utilization metrics' })
  async getTimeTracking(@TenantId() tenantId: string) {
    return this.timeTrackingService.getTimeTracking(tenantId)
  }
}
