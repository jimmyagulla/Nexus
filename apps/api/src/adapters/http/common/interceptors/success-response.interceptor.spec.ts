import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { SuccessResponseInterceptor } from './success-response.interceptor';

describe('SuccessResponseInterceptor', () => {
  let interceptor: SuccessResponseInterceptor;

  beforeEach(() => {
    interceptor = new SuccessResponseInterceptor();
  });

  it('wraps handler result using buildSuccessEnvelope with HTTP status code', async () => {
    const mockResponse = {
      statusCode: 200,
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ message: 'Hello API' }),
    } as CallHandler;

    const result = await new Promise((resolve) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: resolve,
      });
    });

    expect(result).toEqual({
      status: 200,
      message: 'Success',
      data: { message: 'Hello API' },
    });
  });

  it('correctly extracts and forwards status code 201', async () => {
    const mockResponse = {
      statusCode: 201,
    };

    const mockExecutionContext = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
      }),
    } as ExecutionContext;

    const mockCallHandler = {
      handle: () => of({ id: 123 }),
    } as CallHandler;

    const result = await new Promise((resolve) => {
      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: resolve,
      });
    });

    expect(result).toEqual({
      status: 201,
      message: 'Success',
      data: { id: 123 },
    });
  });
});
