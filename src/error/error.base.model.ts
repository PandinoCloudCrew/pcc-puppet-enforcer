import { HttpStatus } from '@nestjs/common';

export class BaseError {
  id: string;
  code: number;
  source: string;
  message: string;
  httpStatus: number;
  stack?: unknown;

  constructor(error: unknown) {
    this.message = BaseError.toErrorWithMessage(error).message;
    this.httpStatus = HttpStatus.BAD_REQUEST;
    this.stack = (error as any)?.stack;
  }

  private static isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }

  private static toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (BaseError.isErrorWithMessage(maybeError)) return maybeError;

    try {
      return new Error(JSON.stringify(maybeError));
    } catch {
      return new Error(String(maybeError));
    }
  }
}

type ErrorWithMessage = {
  message: string;
};
