import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseError } from '../error/error.base.model.js';

@Catch(BaseError)
export class BaseErrorFilter implements ExceptionFilter<BaseError> {
  catch(exception: BaseError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.httpStatus;

    response.status(status).send({
      id: exception.id,
      errorCode: exception.code,
      message: exception.message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
