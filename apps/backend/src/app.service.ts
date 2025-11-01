import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'ok',
      message: 'Zixly Backend API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    }
  }
}
