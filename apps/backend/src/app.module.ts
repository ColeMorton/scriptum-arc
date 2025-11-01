import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { AuthGuard } from './auth/auth.guard'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { PipelinesModule } from './pipelines/pipelines.module'
import { ProjectsModule } from './projects/projects.module'
import { TenantsModule } from './tenants/tenants.module'
import { DashboardsModule } from './dashboards/dashboards.module'
import { ServiceMetricsModule } from './service-metrics/service-metrics.module'
import { TimeTrackingModule } from './time-tracking/time-tracking.module'
import { SyncStatusModule } from './sync-status/sync-status.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    AuthModule,
    HealthModule,
    PipelinesModule,
    ProjectsModule,
    TenantsModule,
    DashboardsModule,
    ServiceMetricsModule,
    TimeTrackingModule,
    SyncStatusModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
