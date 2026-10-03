import { afterEach, describe, expect, it } from 'vitest';
import type { INestApplication } from '@nestjs/common';
import { request as httpRequest } from 'node:http';
import type { AddressInfo } from 'node:net';
import { createNestApp } from './create-app';

async function getJson(
  app: INestApplication,
  path: string,
): Promise<{ status: number; body: unknown }> {
  const server = app.getHttpServer();
  await new Promise<void>((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const { port } = server.address() as AddressInfo;

    return await new Promise((resolve, reject) => {
      httpRequest(
        { hostname: '127.0.0.1', port, path, method: 'GET' },
        (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => {
            data += chunk.toString();
          });
          res.on('end', () => {
            resolve({
              status: res.statusCode ?? 0,
              body: data ? JSON.parse(data) : undefined,
            });
          });
        },
      )
        .on('error', reject)
        .end();
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((err: Error | undefined) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}

describe('createNestApp', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it('serves GET /api with the success envelope', async () => {
    app = await createNestApp();
    await app.init();

    const { status, body } = await getJson(app, '/api');

    expect(status).toBe(200);
    expect(body).toEqual({
      status: 200,
      message: 'Success',
      data: { message: 'Hello API' },
    });
  });
});
