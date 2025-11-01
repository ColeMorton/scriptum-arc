import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SyncStatusService } from './sync-status.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Sync Status')
@ApiBearerAuth()
@Controller('api/sync-status')
export class SyncStatusController {
  constructor(private readonly syncStatusService: SyncStatusService) {}

  @Get()
  @ApiOperation({ summary: 'Get data sync health and workflow status monitoring' })
  async getSyncStatus(@TenantId() tenantId: string) {
    return this.syncStatusService.getSyncStatus(tenantId)
  }
}
