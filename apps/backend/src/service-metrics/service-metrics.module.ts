import { Module } from '@nestjs/common'
import { ServiceMetricsController } from './service-metrics.controller'
import { ServiceMetricsService } from './service-metrics.service'

@Module({
  controllers: [ServiceMetricsController],
  providers: [ServiceMetricsService],
})
export class ServiceMetricsModule {}
