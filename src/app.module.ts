import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FilesModule } from './files/files.module.js';

@Module({
  imports: [FilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
