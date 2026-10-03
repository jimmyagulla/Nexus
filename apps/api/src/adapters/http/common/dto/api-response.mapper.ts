import { HttpException } from '@nestjs/common';
import { ApiResult, ErrorEnvelope, SuccessEnvelope } from './api-response.types';

function isApiResult(obj: unknown): obj is ApiResult<unknown> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'isApiResult' in obj &&
    obj.isApiResult === true
  );
}

export function buildSuccessEnvelope<T>(
  data: T,
  status: number,
): SuccessEnvelope<T> {
  if (isApiResult(data)) {
    const envelope: SuccessEnvelope<unknown> = {
      status,
      message: data.message,
      data: data.data,
    };
    if (data.metadata !== undefined) {
      envelope.metadata = data.metadata;
    }
    return envelope as SuccessEnvelope<T>;
  }

  return {
    status,
    message: 'Success',
    data,
  };
}

export function buildErrorEnvelope(
  status: number,
  message: string,
): ErrorEnvelope {
  return {
    status,
    message,
  };
}

export function extractErrorMessage(exception: unknown): string {
  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    if (typeof response === 'object' && response !== null && 'message' in response) {
      const msg = response.message;
      if (Array.isArray(msg)) {
        return msg.join(', ');
      }
      if (typeof msg === 'string') {
        return msg;
      }
    }
    return exception.message;
  }
  return 'Internal server error';
}
