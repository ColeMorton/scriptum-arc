import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class HealthService {
  constructor(private readonly database: DatabaseService) {}

  async check() {
    try {
      // Check database connection
      await this.database.client.$queryRaw`SELECT 1`

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'up',
          api: 'up',
        },
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'down',
          api: 'up',
        },
        error: error.message,
      }
    }
  }
}
