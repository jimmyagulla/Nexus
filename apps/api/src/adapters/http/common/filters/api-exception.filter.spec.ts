import { ArgumentsHost, HttpException } from '@nestjs/common';
import { describe, it, expect, vi } from 'vitest';
import { ApiExceptionFilter } from './api-exception.filter';

describe('ApiExceptionFilter', () => {
  it('formats HttpException with correct envelope', () => {
    const filter = new ApiExceptionFilter();
    const exception = new HttpException('Not Found', 404);

    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = vi.fn().mockReturnValue({
      status: mockStatus,
    });
    const mockHost: ArgumentsHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: mockGetResponse,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({
      status: 404,
      message: 'Not Found',
    });
  });

  it('formats unknown error with 500 status and safe message', () => {
    const filter = new ApiExceptionFilter();
    const exception = new Error('boom');

    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = vi.fn().mockReturnValue({
      status: mockStatus,
    });
    const mockHost: ArgumentsHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: mockGetResponse,
      }),
    } as unknown as ArgumentsHost;

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal server error',
    });
  });

  it('maps ACCESS_DENIED domain errors to 403', () => {
    const filter = new ApiExceptionFilter();
    const mockJson = vi.fn();
    const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    const mockHost: ArgumentsHost = {
      switchToHttp: vi.fn().mockReturnValue({
        getResponse: vi.fn().mockReturnValue({ status: mockStatus }),
      }),
    } as unknown as ArgumentsHost;

    filter.catch(new Error('ACCESS_DENIED'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(403);
    expect(mockJson).toHaveBeenCalledWith({
      status: 403,
      message: 'ACCESS_DENIED',
    });
  });
});
