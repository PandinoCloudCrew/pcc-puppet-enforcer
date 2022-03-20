import { Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FilesModule } from './files/files.module.js';
import { BaseErrorFilter } from './filters/base.exception.filter.js';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (request) => {
          return request.headers['X-Request-ID'] ?? randomUUID();
        },
        name: 'pcc-puppet-enforce',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport: undefined,
      },
      forRoutes: [],
      exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BaseErrorFilter,
    },
  ],
})
export class AppModule {}
