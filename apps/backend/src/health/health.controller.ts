import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { HealthService } from './health.service'
import { Public } from '../auth/decorators/public.decorator'

@ApiTags('Health')
@Controller('api/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  async checkHealth() {
    return this.healthService.check()
  }
}
