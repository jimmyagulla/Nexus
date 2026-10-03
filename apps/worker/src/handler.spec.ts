import { NestFactory } from '@nestjs/core';
import { handler, resetHandlerContext } from './handler';

const helloEvent = {
  source: 'mock.worker',
  'detail-type': 'hello.requested',
  detail: {},
};

describe('handler', () => {
  afterEach(async () => {
    await resetHandlerContext();
    vi.restoreAllMocks();
  });

  it('handles a hello.requested event through the application context', async () => {
    await expect(handler(helloEvent)).resolves.toEqual({
      message: 'Hello Worker',
    });
  });

  it('reuses the application context across invocations', async () => {
    const createContext = vi.spyOn(NestFactory, 'createApplicationContext');

    await handler(helloEvent);
    await handler(helloEvent);

    expect(createContext).toHaveBeenCalledTimes(1);
  });
});
