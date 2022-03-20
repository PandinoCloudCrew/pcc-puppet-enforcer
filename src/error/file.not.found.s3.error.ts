import { HttpStatus } from '@nestjs/common';
import { BaseError } from './error.base.model.js';

export class FileNotFoundS3Error extends BaseError {
  constructor(source: string, error: unknown) {
    super(error);
    this.code = 100101;
    this.source = source;
    this.httpStatus = HttpStatus.NOT_FOUND;
  }
}
