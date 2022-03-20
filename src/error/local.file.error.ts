import { HttpStatus } from '@nestjs/common';
import { BaseError } from './error.base.model.js';

export class LocalFileError extends BaseError {
  constructor(source: string, error: unknown) {
    super(error);
    this.code = 100100;
    this.httpStatus = HttpStatus.NOT_FOUND;
    this.source = source;
  }
}
