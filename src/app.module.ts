import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FilesModule } from './files/files.module.js';
import { BaseErrorFilter } from './filters/base.exception.filter.js';
import { ResponseMapperInterceptor } from './filters/response.mapper.interceptor.js';

@Module({
  imports: [FilesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: BaseErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseMapperInterceptor,
    },
  ],
})
export class AppModule {}
