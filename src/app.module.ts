import { Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { nanoid } from 'nanoid';
import { LoggerModule } from 'nestjs-pino';
import { ReqId } from 'pino-http';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FilesModule } from './files/files.module.js';
import { BaseErrorFilter } from './filters/base.exception.filter.js';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            genReqId: (request): ReqId => {
              return request.headers['X-Request-ID'] ?? nanoid();
            },
            name: 'pcc-puppet-enforce',
            level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
            transport: undefined,
          },
          forRoutes: [],
          exclude: [{ method: RequestMethod.ALL, path: 'health' }],
        };
      },
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
