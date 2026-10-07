import { ArgumentsHost, HttpException } from '@nestjs/common';
import { describe, it, expect } from 'vitest';
import { ApiExceptionFilter } from './api-exception.filter';

type SentResponse = {
  status: number;
  body: unknown;
};

class RecordingHttpResponse {
  sent: SentResponse | undefined;

  status(status: number) {
    return {
      json: (body: unknown) => {
        this.sent = { status, body };
      },
    };
  }

  asHost(): ArgumentsHost {
    return {
      switchToHttp: () => ({ getResponse: () => this }),
    } as unknown as ArgumentsHost;
  }
}

function sendThrough(exception: unknown): SentResponse | undefined {
  const response = new RecordingHttpResponse();
  new ApiExceptionFilter().catch(exception, response.asHost());
  return response.sent;
}

describe('ApiExceptionFilter', () => {
  it('formats HttpException with correct envelope', () => {
    expect(sendThrough(new HttpException('Not Found', 404))).toEqual({
      status: 404,
      body: { status: 404, message: 'Not Found' },
    });
  });

  it('joins the validation messages of a bad request', () => {
    expect(
      sendThrough(new HttpException({ message: ['too short', 'required'] }, 400)),
    ).toEqual({
      status: 400,
      body: { status: 400, message: 'too short, required' },
    });
  });

  it('formats unknown error with 500 status and safe message', () => {
    expect(sendThrough(new Error('boom'))).toEqual({
      status: 500,
      body: { status: 500, message: 'Internal server error' },
    });
  });

  it('maps ACCESS_DENIED domain errors to 403', () => {
    expect(sendThrough(new Error('ACCESS_DENIED'))).toEqual({
      status: 403,
      body: { status: 403, message: 'ACCESS_DENIED' },
    });
  });

  it('maps other domain errors to 400', () => {
    expect(sendThrough(new Error('REQUIRED_INFORMATION'))).toEqual({
      status: 400,
      body: { status: 400, message: 'REQUIRED_INFORMATION' },
    });
  });
});
