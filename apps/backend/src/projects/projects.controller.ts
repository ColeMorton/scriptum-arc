import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { TenantId } from '../auth/decorators/tenant-id.decorator'

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('api/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get project metrics and billable hours' })
  async getProjects(@TenantId() tenantId: string) {
    return this.projectsService.getProjectMetrics(tenantId)
  }
}
