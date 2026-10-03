import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};

export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe(VALIDATION_PIPE_OPTIONS);
}
