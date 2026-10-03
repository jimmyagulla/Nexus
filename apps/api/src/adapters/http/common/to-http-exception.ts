import {
  BadRequestException,
  ForbiddenException,
  HttpException,
} from '@nestjs/common';
import { ErrorMessage } from '@hexagonal-monorepo-template/domain';

export function toHttpException(error: unknown): HttpException {
  if (error instanceof HttpException) {
    return error;
  }
  if (
    error instanceof Error &&
    error.message === ErrorMessage.NON_AUTORISE
  ) {
    return new ForbiddenException(error.message);
  }
  if (error instanceof Error) {
    return new BadRequestException(error.message);
  }
  return new BadRequestException();
}
