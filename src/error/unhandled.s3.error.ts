import { HttpStatus } from '@nestjs/common';
import { BaseError } from './error.base.model.js';

export class UnhandledS3Error extends BaseError {
  constructor(source: string, error: unknown) {
    super(error);
    this.code = 100999;
    this.source = source;
    this.httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
  }
}
