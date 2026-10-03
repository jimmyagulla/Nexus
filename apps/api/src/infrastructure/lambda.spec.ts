import { afterEach, describe, expect, it, vi } from 'vitest';
import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { handler, resetLambdaServerCache } from './lambda';

function httpApiGetEvent(path: string): APIGatewayProxyEventV2 {
  return {
    version: '2.0',
    routeKey: `GET ${path}`,
    rawPath: path,
    rawQueryString: '',
    headers: {
      accept: 'application/json',
      host: 'localhost',
    },
    requestContext: {
      accountId: '123456789012',
      apiId: 'api-id',
      domainName: 'localhost',
      domainPrefix: 'localhost',
      http: {
        method: 'GET',
        path,
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: 'vitest',
      },
      requestId: 'id',
      routeKey: `GET ${path}`,
      stage: '$default',
      time: '12/Mar/2020:19:03:58 +0000',
      timeEpoch: 1583348638390,
    },
    isBase64Encoded: false,
  };
}

function lambdaContext(): Context {
  return {
    callbackWaitsForEmptyEventLoop: true,
    functionName: 'api',
    functionVersion: '$LATEST',
    invokedFunctionArn: 'arn:aws:lambda:eu-west-1:123456789012:function:api',
    memoryLimitInMB: '128',
    awsRequestId: 'id',
    logGroupName: '/aws/lambda/api',
    logStreamName: 'stream',
    getRemainingTimeInMillis: () => 10_000,
    done: () => undefined,
    fail: () => undefined,
    succeed: () => undefined,
  };
}

describe('lambda handler', () => {
  afterEach(async () => {
    await resetLambdaServerCache();
  });

  it('returns the success envelope for GET /api', async () => {
    const result = await handler(httpApiGetEvent('/api'), lambdaContext(), () => undefined);

    expect(result).toMatchObject({
      statusCode: 200,
    });
    expect(JSON.parse((result as { body: string }).body)).toEqual({
      status: 200,
      message: 'Success',
      data: { message: 'Hello API' },
    });
  });

  it('bootstraps Nest only once across invocations', async () => {
    const createSpy = vi.spyOn(NestFactory, 'create');
    const event = httpApiGetEvent('/api');
    const context = lambdaContext();

    await handler(event, context, () => undefined);
    await handler(event, context, () => undefined);

    expect(createSpy).toHaveBeenCalledTimes(1);
    createSpy.mockRestore();
  });

  it('returns 404 for an unknown route', async () => {
    const result = await handler(
      httpApiGetEvent('/api/unknown'),
      lambdaContext(),
      () => undefined,
    );

    expect(result).toMatchObject({
      statusCode: 404,
    });
    expect(JSON.parse((result as { body: string }).body)).toEqual({
      status: 404,
      message: 'Cannot GET /api/unknown',
    });
  });
});
