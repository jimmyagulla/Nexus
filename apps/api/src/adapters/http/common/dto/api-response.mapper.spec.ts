import { describe, expect, it } from 'vitest';
import { HttpException } from '@nestjs/common';
import {
  buildSuccessEnvelope,
  buildErrorEnvelope,
  extractErrorMessage,
} from './api-response.mapper';

describe('buildSuccessEnvelope', () => {
  it('wraps plain data with status 200 and default success message', () => {
    const data = { message: 'Hello API' };
    const envelope = buildSuccessEnvelope(data, 200);

    expect(envelope).toEqual({
      status: 200,
      message: 'Success',
      data: { message: 'Hello API' },
    });
  });

  it('uses custom message and metadata from ApiResult', () => {
    const result = {
      isApiResult: true,
      data: { id: 123 },
      message: 'Resource created',
      metadata: { timestamp: '2026-09-04T19:00:00Z' },
    };
    const envelope = buildSuccessEnvelope(result, 201);

    expect(envelope).toEqual({
      status: 201,
      message: 'Resource created',
      data: { id: 123 },
      metadata: { timestamp: '2026-09-04T19:00:00Z' },
    });
  });

  it('omits metadata key when ApiResult has no metadata', () => {
    const result = {
      isApiResult: true,
      data: { id: 456 },
      message: 'Resource fetched',
    };
    const envelope = buildSuccessEnvelope(result, 200);

    expect(envelope).toEqual({
      status: 200,
      message: 'Resource fetched',
      data: { id: 456 },
    });
    expect(envelope).not.toHaveProperty('metadata');
  });

  it('wraps null as data', () => {
    const envelope = buildSuccessEnvelope(null, 204);

    expect(envelope).toEqual({
      status: 204,
      message: 'Success',
      data: null,
    });
  });

  it('wraps empty array as data', () => {
    const envelope = buildSuccessEnvelope([], 200);

    expect(envelope).toEqual({
      status: 200,
      message: 'Success',
      data: [],
    });
  });

  it('wraps string primitive as data', () => {
    const envelope = buildSuccessEnvelope('text', 200);

    expect(envelope).toEqual({
      status: 200,
      message: 'Success',
      data: 'text',
    });
  });

  it('wraps number primitive as data', () => {
    const envelope = buildSuccessEnvelope(42, 200);

    expect(envelope).toEqual({
      status: 200,
      message: 'Success',
      data: 42,
    });
  });
});

describe('buildErrorEnvelope', () => {
  it('builds error envelope with status and message', () => {
    const envelope = buildErrorEnvelope(404, 'Not Found');

    expect(envelope).toEqual({
      status: 404,
      message: 'Not Found',
    });
  });
});

describe('extractErrorMessage', () => {
  it('extracts message from HttpException', () => {
    const exception = new HttpException('Not Found', 404);
    const message = extractErrorMessage(exception);

    expect(message).toBe('Not Found');
  });

  it('extracts and joins message array from HttpException with object response', () => {
    const exception = new HttpException({ message: ['error 1', 'error 2'] }, 400);
    const message = extractErrorMessage(exception);

    expect(message).toBe('error 1, error 2');
  });

  it('returns "Internal server error" for plain Error instances', () => {
    const exception = new Error('sensitive error message');
    const message = extractErrorMessage(exception);

    expect(message).toBe('Internal server error');
  });
});
