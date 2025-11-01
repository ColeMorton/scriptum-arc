import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TenantsService } from './tenants.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('api/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get tenant information' })
  async getTenant(@TenantId() tenantId: string) {
    return this.tenantsService.getTenant(tenantId)
  }
}
