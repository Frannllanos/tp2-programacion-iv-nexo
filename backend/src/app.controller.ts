import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      app: 'NEXO API',
      sprint: '1-2',
      timestamp: new Date().toISOString(),
    };
  }
}
