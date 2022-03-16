import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

import awsLambdaFastify, {
  LambdaResponse,
  PromiseHandler,
} from 'aws-lambda-fastify';
import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify';
import compression from 'fastify-compress';
import 'reflect-metadata';
import { AppModule } from './app.module.js';

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

Sentry.init({
  dsn: 'https://40b69a92eb9141e3b52277301b5bd031@o1149738.ingest.sentry.io/6222146',
  integrations: [
    new RewriteFrames({
      root: global.__dirname,
    }),
    new Sentry.Integrations.Console(),
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  debug: true,
  environment: process.env.NODE_ENV,
  release: `${process.env.npm_package_name}@${process.env.npm_package_version}`,
});

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
