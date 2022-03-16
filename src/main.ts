import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import compression from 'fastify-compress';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { FastifyServerOptions, FastifyInstance, fastify } from 'fastify';
import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { Logger } from '@nestjs/common';

import awsLambdaFastify, {
  LambdaResponse,
  PromiseHandler,
} from 'aws-lambda-fastify';

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

let cachedNestApp: NestApp;
let cachedProxy: PromiseHandler<unknown, LambdaResponse>;

async function bootstrapServer(): Promise<NestApp> {
  const serverOptions: FastifyServerOptions = { logger: true };
  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    { logger: !process.env.AWS_EXECUTION_ENV ? new Logger() : console },
  );
  app.setGlobalPrefix(process.env.API_PREFIX);
  await app.init();
  return { app, instance };
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrapServer();
  }
  if (!cachedProxy) {
    cachedProxy = awsLambdaFastify(cachedNestApp.instance, {
      decorateRequest: true,
    });
    await cachedNestApp.instance.ready();
  }
  return cachedProxy(event, context);
};

async function bootstrap(): Promise<void> {
  if (!cachedNestApp) {
    cachedNestApp = await bootstrapServer();
  }
  await cachedNestApp.app.register(compression, {
    encodings: ['gzip', 'deflate'],
  });
  cachedNestApp.app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await cachedNestApp.app.listen(3000);
}

if (process.env.RUN_STANDALONE) bootstrap();
